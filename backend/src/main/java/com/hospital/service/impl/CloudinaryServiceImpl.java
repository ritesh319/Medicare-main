package com.hospital.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospital.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.HexFormat;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {
    private final String cloudName, apiKey, apiSecret; private final ObjectMapper objectMapper;
    public CloudinaryServiceImpl(@Value("${cloudinary.cloud-name:}") String cloudName, @Value("${cloudinary.api-key:}") String apiKey, @Value("${cloudinary.api-secret:}") String apiSecret, ObjectMapper objectMapper) { this.cloudName=cloudName; this.apiKey=apiKey; this.apiSecret=apiSecret; this.objectMapper=objectMapper; }
    @Override public UploadResult uploadProofDocument(MultipartFile file) {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("Proof document is required");
        if (file.getSize() > 10 * 1024 * 1024L) throw new IllegalArgumentException("Proof document must be 10MB or smaller");
        String type = file.getContentType() == null ? "" : file.getContentType().toLowerCase();
        if (!(type.equals("application/pdf") || type.equals("image/jpeg") || type.equals("image/png"))) throw new IllegalArgumentException("Proof document must be a PDF, JPG, or PNG");
        if (cloudName.isBlank() || apiKey.isBlank() || apiSecret.isBlank()) throw new IllegalStateException("Cloudinary is not configured");
        try {
            long timestamp = Instant.now().getEpochSecond(); String signature = sha1("timestamp=" + timestamp + apiSecret); String boundary = "----Medicare" + System.currentTimeMillis();
            String filename = file.getOriginalFilename() == null ? "proof-document.pdf" : file.getOriginalFilename().replaceAll("[^A-Za-z0-9._-]", "_");
            String body = multipart(boundary, apiKey, String.valueOf(timestamp), signature, file.getContentType(), filename, file.getBytes());
            HttpRequest request = HttpRequest.newBuilder().uri(URI.create("https://api.cloudinary.com/v1_1/" + cloudName + "/raw/upload")).header("Content-Type", "multipart/form-data; boundary=" + boundary).POST(HttpRequest.BodyPublishers.ofString(body, StandardCharsets.ISO_8859_1)).build();
            HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != HttpStatus.OK.value()) throw new IllegalStateException("Cloudinary upload failed");
            JsonNode json = objectMapper.readTree(response.body()); return new UploadResult(json.path("secure_url").asText(), json.path("public_id").asText());
        } catch (Exception ex) { throw new IllegalStateException("Could not upload proof document", ex); }
    }
    private String multipart(String b, String key, String timestamp, String signature, String type, String filename, byte[] bytes) {
        String pre = "--" + b + "\r\nContent-Disposition: form-data; name=\"api_key\"\r\n\r\n" + key + "\r\n" + "--" + b + "\r\nContent-Disposition: form-data; name=\"timestamp\"\r\n\r\n" + timestamp + "\r\n" + "--" + b + "\r\nContent-Disposition: form-data; name=\"signature\"\r\n\r\n" + signature + "\r\n" + "--" + b + "\r\nContent-Disposition: form-data; name=\"file\"; filename=\"" + filename + "\"\r\nContent-Type: " + type + "\r\n\r\n";
        return pre + new String(bytes, StandardCharsets.ISO_8859_1) + "\r\n--" + b + "--\r\n";
    }
    private String sha1(String value) throws Exception { return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-1").digest(value.getBytes(StandardCharsets.UTF_8))); }
}
