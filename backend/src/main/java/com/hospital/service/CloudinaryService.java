package com.hospital.service;
import org.springframework.web.multipart.MultipartFile;
public interface CloudinaryService {
    UploadResult uploadProofDocument(MultipartFile file);
    record UploadResult(String secureUrl, String publicId) {}
}
