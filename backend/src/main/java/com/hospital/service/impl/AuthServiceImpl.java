package com.hospital.service.impl;

import com.hospital.dto.request.DoctorRegistrationRequest;
import com.hospital.dto.request.LoginRequest;
import com.hospital.dto.request.RegisterRequest;
import com.hospital.dto.response.AuthResponse;
import com.hospital.exception.DoctorApprovalException;
import com.hospital.exception.DuplicateResourceException;
import com.hospital.model.*;
import com.hospital.repository.*;
import com.hospital.security.JwtUtils;
import com.hospital.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.*;

@Service @RequiredArgsConstructor @Slf4j
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository; private final PatientRepository patientRepository; private final DoctorRepository doctorRepository; private final PasswordEncoder passwordEncoder; private final JwtUtils jwtUtils; private final AuthenticationManager authenticationManager; private final CloudinaryService cloudinaryService;
    @Override public AuthResponse register(RegisterRequest request) {
        if ("DOCTOR".equalsIgnoreCase(request.getRole())) {
            throw new DoctorApprovalException("Doctor registrations must include an application and proof document.", HttpStatus.BAD_REQUEST);
        }
        if(userRepository.existsByEmail(request.getEmail())) throw new DuplicateResourceException("Email already registered: "+request.getEmail());
        String roleName="PATIENT".equalsIgnoreCase(request.getRole())?Role.PATIENT:Role.DOCTOR; User saved=userRepository.save(User.builder().email(request.getEmail()).password(passwordEncoder.encode(request.getPassword())).firstName(request.getFirstName()).lastName(request.getLastName()).phone(request.getPhone()).roles(Set.of(roleName)).enabled(true).accountNonExpired(true).accountNonLocked(true).credentialsNonExpired(true).createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build());
        String profileId; if(Role.PATIENT.equals(roleName)) profileId=patientRepository.save(Patient.builder().userId(saved.getId()).firstName(request.getFirstName()).lastName(request.getLastName()).email(request.getEmail()).phone(request.getPhone()).createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build()).getId(); else profileId=doctorRepository.save(Doctor.builder().userId(saved.getId()).firstName(request.getFirstName()).lastName(request.getLastName()).email(request.getEmail()).phone(request.getPhone()).active(true).approvalStatus("APPROVED").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build()).getId();
        return authResponse(saved,profileId,false);
    }
    @Override public void registerDoctor(DoctorRegistrationRequest request, MultipartFile proofDocument) {
        if(userRepository.existsByEmail(request.getEmail())) throw new DuplicateResourceException("Email already registered: "+request.getEmail());
        CloudinaryService.UploadResult upload=cloudinaryService.uploadProofDocument(proofDocument); LocalDateTime now=LocalDateTime.now();
        User user=userRepository.save(User.builder().email(request.getEmail()).password(passwordEncoder.encode(request.getPassword())).firstName(request.getFirstName()).lastName(request.getLastName()).phone(request.getPhone()).roles(Set.of(Role.DOCTOR)).enabled(false).accountNonExpired(true).accountNonLocked(true).credentialsNonExpired(true).createdAt(now).updatedAt(now).build());
        doctorRepository.save(Doctor.builder().userId(user.getId()).firstName(request.getFirstName()).lastName(request.getLastName()).email(request.getEmail()).phone(request.getPhone()).specialization(request.getSpecialization()).qualification(request.getQualification()).department(request.getDepartment()).experienceYears(request.getExperienceYears()).licenseNumber(request.getLicenseNumber()).proofDocumentUrl(upload.secureUrl()).proofDocumentPublicId(upload.publicId()).approvalStatus("PENDING").active(false).createdAt(now).updatedAt(now).build());
    }
    @Override public AuthResponse login(LoginRequest request) {
        User existing=userRepository.findByEmail(request.getEmail()).orElse(null); if(existing!=null && existing.getRoles().contains(Role.DOCTOR)) { Doctor doctor=doctorRepository.findByUserId(existing.getId()).orElse(null); String status=doctor==null||doctor.getApprovalStatus()==null?"APPROVED":doctor.getApprovalStatus(); if("PENDING".equalsIgnoreCase(status)) throw new DoctorApprovalException("Your doctor account is still pending admin approval. Please try again later.",HttpStatus.FORBIDDEN); if("REJECTED".equalsIgnoreCase(status)) throw new DoctorApprovalException("Doctor approval was not granted. Please contact the administrator.",HttpStatus.FORBIDDEN); }
        Authentication authentication=authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(),request.getPassword())); UserDetails details=(UserDetails)authentication.getPrincipal(); User user=userRepository.findByEmail(request.getEmail()).orElseThrow(); return authResponse(user,resolveProfileId(user),true,details);
    }
    @Override public AuthResponse refreshToken(String token) { if(!jwtUtils.validateToken(token)) throw new RuntimeException("Invalid refresh token"); User user=userRepository.findByEmail(jwtUtils.extractEmail(token)).orElseThrow(); return authResponse(user,resolveProfileId(user),false); }
    private AuthResponse authResponse(User u,String profileId,boolean refresh){ return authResponse(u,profileId,refresh,null); }
    private AuthResponse authResponse(User u,String profileId,boolean refresh,UserDetails details){ Map<String,Object> claims=new HashMap<>(); claims.put("roles",u.getRoles()); claims.put("profileId",profileId); AuthResponse.AuthResponseBuilder b=AuthResponse.builder().token(jwtUtils.generateToken(u.getEmail(),claims)).type("Bearer").id(u.getId()).email(u.getEmail()).firstName(u.getFirstName()).lastName(u.getLastName()).roles(u.getRoles()).profileId(profileId); if(refresh&&details!=null)b.refreshToken(jwtUtils.generateRefreshToken(details)); return b.build(); }
    private String resolveProfileId(User user){ if(user.getRoles().contains(Role.PATIENT)) return patientRepository.findByUserId(user.getId()).map(Patient::getId).orElse(null); if(user.getRoles().contains(Role.DOCTOR)) return doctorRepository.findByUserId(user.getId()).map(Doctor::getId).orElse(null); return null; }
}
