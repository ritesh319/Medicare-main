package com.hospital.service.impl;

import com.hospital.dto.request.MedicalRecordRequest;
import com.hospital.dto.request.PatientProfileRequest;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.model.Patient;
import com.hospital.repository.PatientRepository;
import com.hospital.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    @Override
    public Patient getPatientById(String id) {
        if (id == null) {
            throw new ResourceNotFoundException("Patient", "id", id);
        }
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));
        assertCallerOwnsPatientRecord(patient);
        return patient;
    }

    @Override
    public Patient getPatientByUserId(String userId) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "userId", userId));
        assertCallerOwnsPatientRecord(patient);
        return patient;
    }

    /**
     * A PATIENT may only access their own record. ADMIN and DOCTOR are unrestricted here,
     * matching the existing @PreAuthorize rules on the controller endpoints.
     */
    private void assertCallerOwnsPatientRecord(Patient patient) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean callerIsPatient = authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_PATIENT"));
        if (callerIsPatient) {
            String callerEmail = authentication.getName();
            if (callerEmail == null || !callerEmail.equalsIgnoreCase(patient.getEmail())) {
                throw new AccessDeniedException("You are not allowed to access this patient's record.");
            }
        }
    }

    @Override
    public Patient updateProfile(String id, PatientProfileRequest request) {
        Patient patient = getPatientById(id);

        if (request.getFirstName() != null) patient.setFirstName(request.getFirstName());
        if (request.getLastName() != null) patient.setLastName(request.getLastName());
        if (request.getPhone() != null) patient.setPhone(request.getPhone());
        if (request.getDateOfBirth() != null) patient.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) patient.setGender(request.getGender());
        if (request.getBloodGroup() != null) patient.setBloodGroup(request.getBloodGroup());
        if (request.getAllergies() != null) patient.setAllergies(request.getAllergies());
        if (request.getCurrentMedications() != null) patient.setCurrentMedications(request.getCurrentMedications());

        if (request.getAddress() != null) {
            PatientProfileRequest.AddressRequest a = request.getAddress();
            patient.setAddress(Patient.Address.builder()
                    .street(a.getStreet())
                    .city(a.getCity())
                    .state(a.getState())
                    .zipCode(a.getZipCode())
                    .country(a.getCountry())
                    .build());
        }

        if (request.getEmergencyContact() != null) {
            PatientProfileRequest.EmergencyContactRequest ec = request.getEmergencyContact();
            patient.setEmergencyContact(Patient.EmergencyContact.builder()
                    .name(ec.getName())
                    .relationship(ec.getRelationship())
                    .phone(ec.getPhone())
                    .build());
        }

        patient.setUpdatedAt(LocalDateTime.now());
        return patientRepository.save(patient);
    }

    @Override
    public Patient addMedicalRecord(String id, MedicalRecordRequest request) {
        Patient patient = getPatientById(id);

        Patient.MedicalRecord record = Patient.MedicalRecord.builder()
                .id(UUID.randomUUID().toString())
                .diagnosis(request.getDiagnosis())
                .treatment(request.getTreatment())
                .prescribedBy(request.getPrescribedBy())
                .date(request.getDate())
                .notes(request.getNotes())
                .build();

        patient.getMedicalHistory().add(record);
        patient.setUpdatedAt(LocalDateTime.now());
        return patientRepository.save(patient);
    }

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    public List<Patient> searchPatients(String query) {
        return patientRepository
                .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query, query);
    }

    @Override
    public void deletePatient(String id) {
        if (id == null || !patientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Patient", "id", id);
        }
        patientRepository.deleteById(id);
    }
}
