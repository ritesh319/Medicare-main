package com.hospital.dto.response;

import com.hospital.model.Doctor;
import lombok.Builder;
import lombok.Data;

@Data @Builder
public class DoctorApplicationResponse {
    private Doctor doctor;
    private String approvalStatus;
    private String message;
}
