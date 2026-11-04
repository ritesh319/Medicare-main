package com.hospital.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospital.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
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

    private final String cloudName;
    private final String apiKey;
    private final String apiSecret;
    private final ObjectMapper objectMapper;

    public CloudinaryServiceImpl(
            @Value("${cloudinary.cloud-name:}") String cloudName,
            @Value("${cloudinary.api-key:}") String apiKey,
            @Value("${cloudinary.api-secret:}") String apiSecret,
            ObjectMapper objectMapper
    ) {
        this.cloudName = cloudName;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.objectMapper = objectMapper;
    }

    @Override
    public UploadResult uploadProofDocument(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Proof document is required");
        }

        if (file.getSize() > 10 * 1024 * 1024L) {
            throw new IllegalArgumentException(
                    "Proof document must be 10MB or smaller"
            );
        }

        String type = file.getContentType() == null
                ? ""
                : file.getContentType().toLowerCase();

        if (!type.equals("application/pdf")
                && !type.equals("image/jpeg")
                && !type.equals("image/png")) {
            throw new IllegalArgumentException(
                    "Proof document must be a PDF, JPG, or PNG"
            );
        }

        if (cloudName.isBlank()
                || apiKey.isBlank()
                || apiSecret.isBlank()) {
            throw new IllegalStateException(
                    "Cloudinary is not configured"
            );
        }

        try {
            long timestamp = Instant.now().getEpochSecond();

            String signature = sha1(
                    "timestamp=" + timestamp + apiSecret
            );

            String boundary =
                    "----Medicare" + System.currentTimeMillis();

            String filename = file.getOriginalFilename() == null
                    ? "proof-document.pdf"
                    : file.getOriginalFilename()
                            .replaceAll("[^A-Za-z0-9._-]", "_");

            byte[] body = createMultipartBody(
                    boundary,
                    apiKey,
                    String.valueOf(timestamp),
                    signature,
                    file.getContentType(),
                    filename,
                    file.getBytes()
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(
                            URI.create(
                                    "https://api.cloudinary.com/v1_1/"
                                            + cloudName
                                            + "/raw/upload"
                            )
                    )
                    .header(
                            "Content-Type",
                            "multipart/form-data; boundary=" + boundary
                    )
                    .POST(
                            HttpRequest.BodyPublishers.ofByteArray(body)
                    )
                    .build();

            HttpResponse<String> response =
                    HttpClient.newHttpClient().send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );

            if (response.statusCode() != HttpStatus.OK.value()) {
                throw new IllegalStateException(
                        "Cloudinary upload failed. HTTP "
                                + response.statusCode()
                                + ": "
                                + response.body()
                );
            }

            JsonNode json = objectMapper.readTree(response.body());

            return new UploadResult(
                    json.path("secure_url").asText(),
                    json.path("public_id").asText()
            );

        } catch (IllegalStateException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new IllegalStateException(
                    "Could not upload proof document",
                    ex
            );
        }
    }

    private byte[] createMultipartBody(
            String boundary,
            String apiKey,
            String timestamp,
            String signature,
            String contentType,
            String filename,
            byte[] fileBytes
    ) throws IOException {

        ByteArrayOutputStream output =
                new ByteArrayOutputStream(fileBytes.length + 1024);

        write(
                output,
                "--" + boundary
                        + "\r\nContent-Disposition: form-data; "
                        + "name=\"api_key\"\r\n\r\n"
                        + apiKey
                        + "\r\n"
        );

        write(
                output,
                "--" + boundary
                        + "\r\nContent-Disposition: form-data; "
                        + "name=\"timestamp\"\r\n\r\n"
                        + timestamp
                        + "\r\n"
        );

        write(
                output,
                "--" + boundary
                        + "\r\nContent-Disposition: form-data; "
                        + "name=\"signature\"\r\n\r\n"
                        + signature
                        + "\r\n"
        );

        write(
                output,
                "--" + boundary
                        + "\r\nContent-Disposition: form-data; "
                        + "name=\"file\"; filename=\""
                        + filename
                        + "\"\r\nContent-Type: "
                        + contentType
                        + "\r\n\r\n"
        );

        output.write(fileBytes);

        write(
                output,
                "\r\n--" + boundary + "--\r\n"
        );

        return output.toByteArray();
    }

    private void write(
            ByteArrayOutputStream output,
            String value
    ) throws IOException {
        output.write(
                value.getBytes(StandardCharsets.UTF_8)
        );
    }

    private String sha1(String value) throws Exception {
        return HexFormat.of().formatHex(
                MessageDigest.getInstance("SHA-1")
                        .digest(
                                value.getBytes(StandardCharsets.UTF_8)
                        )
        );
    }
}
