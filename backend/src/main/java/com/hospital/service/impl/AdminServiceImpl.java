package com.hospital.service.impl;
import com.hospital.dto.response.DashboardStatsResponse;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.model.Doctor;
import com.hospital.model.Appointment.AppointmentStatus;
import com.hospital.repository.*;
import com.hospital.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate; import java.time.LocalDateTime; import java.util.List;
@Service @RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final PatientRepository patientRepository; private final DoctorRepository doctorRepository; private final AppointmentRepository appointmentRepository; private final UserRepository userRepository;
    public DashboardStatsResponse getDashboardStats(){ long today=appointmentRepository.findByDateRange(LocalDate.now(),LocalDate.now()).size(); return DashboardStatsResponse.builder().totalPatients(patientRepository.count()).totalDoctors(doctorRepository.count()).totalAppointments(appointmentRepository.count()).pendingAppointments(appointmentRepository.countByStatus(AppointmentStatus.PENDING)).confirmedAppointments(appointmentRepository.countByStatus(AppointmentStatus.CONFIRMED)).completedAppointments(appointmentRepository.countByStatus(AppointmentStatus.COMPLETED)).cancelledAppointments(appointmentRepository.countByStatus(AppointmentStatus.CANCELLED)).todaysAppointments(today).build(); }
    public List<Doctor> getPendingDoctorApplications(){ return doctorRepository.findByApprovalStatus("PENDING"); }
    public Doctor getDoctorApplication(String id){ return doctorRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Doctor","id",id)); }
    public Doctor approveDoctor(String id){ return decide(getDoctorApplication(id),true); }
    public Doctor rejectDoctor(String id){ return decide(getDoctorApplication(id),false); }
    private Doctor decide(Doctor doctor, boolean approved){ doctor.setApprovalStatus(approved?"APPROVED":"REJECTED"); doctor.setActive(approved); doctor.setUpdatedAt(LocalDateTime.now()); doctorRepository.save(doctor); userRepository.findById(doctor.getUserId()).ifPresent(user->{ user.setEnabled(approved); user.setUpdatedAt(LocalDateTime.now()); userRepository.save(user); }); return doctor; }
}
