package com.hospital.config;

import com.mongodb.client.model.IndexOptions;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class AppointmentIndexInitializer {

    private final MongoTemplate mongoTemplate;

    @PostConstruct
    public void createActiveDoctorSlotIndex() {
        Document keys = new Document()
                .append("doctorId", 1)
                .append("appointmentDate", 1)
                .append("timeSlot", 1);

        Document activeStatuses = new Document("$in", List.of(
                "PENDING",
                "CONFIRMED",
                "NO_SHOW"
        ));

        IndexOptions options = new IndexOptions()
                .name("unique_active_doctor_slot")
                .unique(true)
                .partialFilterExpression(
                        new Document("status", activeStatuses)
                );

        mongoTemplate.getCollection("appointments")
                .createIndex(keys, options);
    }
}
