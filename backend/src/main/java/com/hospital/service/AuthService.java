package com.hospital.service;

import com.hospital.dto.request.LoginRequest;
import com.hospital.dto.request.DoctorRegistrationRequest;
import org.springframework.web.multipart.MultipartFile;
import com.hospital.dto.request.RegisterRequest;
import com.hospital.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    void registerDoctor(DoctorRegistrationRequest request, MultipartFile proofDocument);
    AuthResponse refreshToken(String refreshToken);
}
