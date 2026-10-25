package com.hospital.service;
import com.hospital.dto.response.DashboardStatsResponse;
import com.hospital.model.Doctor;
import java.util.List;
public interface AdminService {
    DashboardStatsResponse getDashboardStats();
    List<Doctor> getPendingDoctorApplications();
    Doctor getDoctorApplication(String id);
    Doctor approveDoctor(String id);
    Doctor rejectDoctor(String id);
}
