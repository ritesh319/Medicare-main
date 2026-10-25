package com.hospital.controller;
import com.hospital.dto.response.*; import com.hospital.model.Doctor; import com.hospital.service.AdminService; import lombok.RequiredArgsConstructor; import org.springframework.http.ResponseEntity; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.web.bind.annotation.*; import java.util.List;
@RestController @RequestMapping("/admin") @RequiredArgsConstructor @PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final AdminService adminService;
    @GetMapping("/dashboard/stats") public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats(){ return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats())); }
    @GetMapping("/doctors/pending") public ResponseEntity<ApiResponse<List<Doctor>>> pending(){ return ResponseEntity.ok(ApiResponse.success(adminService.getPendingDoctorApplications())); }
    @GetMapping("/doctors/{id}") public ResponseEntity<ApiResponse<Doctor>> details(@PathVariable String id){ return ResponseEntity.ok(ApiResponse.success(adminService.getDoctorApplication(id))); }
    @PatchMapping("/doctors/{id}/approve") public ResponseEntity<ApiResponse<Doctor>> approve(@PathVariable String id){ return ResponseEntity.ok(ApiResponse.success("Doctor approved",adminService.approveDoctor(id))); }
    @PatchMapping("/doctors/{id}/reject") public ResponseEntity<ApiResponse<Doctor>> reject(@PathVariable String id){ return ResponseEntity.ok(ApiResponse.success("Doctor rejected",adminService.rejectDoctor(id))); }
}
