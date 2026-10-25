package com.hospital.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class DoctorApprovalException extends RuntimeException {
    private final HttpStatus status;
    public DoctorApprovalException(String message, HttpStatus status) { super(message); this.status = status; }
}
