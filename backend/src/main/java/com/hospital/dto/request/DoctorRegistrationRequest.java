package com.hospital.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DoctorRegistrationRequest {
    @NotBlank @Size(min = 2, max = 50) private String firstName;
    @NotBlank @Size(min = 2, max = 50) private String lastName;
    @NotBlank @Email private String email;
    @NotBlank @Size(min = 8) @Pattern(regexp = "^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$") private String password;
    @NotBlank @Pattern(regexp = "^[+]?[0-9]{10,15}$") private String phone;
    @NotBlank private String specialization;
    @NotBlank private String qualification;
    @NotBlank private String department;
    @Min(0) private int experienceYears;
    @NotBlank private String licenseNumber;
}
