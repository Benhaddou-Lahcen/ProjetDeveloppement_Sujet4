package com.hospital.patient.service.impl;

import com.hospital.patient.dto.PageResponse;
import com.hospital.patient.dto.PatientCreateRequest;
import com.hospital.patient.dto.PatientDTO;
import com.hospital.patient.exception.PatientNotFoundException;
import com.hospital.patient.exception.DuplicatePatientException;
import com.hospital.patient.mapper.PatientMapper;
import com.hospital.patient.model.Patient;
import com.hospital.patient.repository.PatientRepository;
import com.hospital.patient.service.PatientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    PATIENT SERVICE IMPLEMENTATION                            ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS CLASS EXISTS:                                                      ║
 * ║  Implements the business logic for patient operations.                       ║
 * ║                                                                              ║
 * ║  @Transactional: Ensures database operations are atomic                      ║
 * ║  @RequiredArgsConstructor: Lombok generates constructor with final fields    ║
 * ║  @Slf4j: Lombok generates a logger instance                                  ║
 * ║                                                                              ║
 * ║  // Business logic will be added in the specialized subject                  ║
 * ║  Students: This is where you implement your business rules.                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;

    @Override
    public PatientDTO createPatient(PatientCreateRequest request) {
        log.info("Creating new patient with national ID: {}", request.getNationalId());

        // Check for duplicate national ID
        // // Business logic will be added in the specialized subject
        if (patientRepository.existsByNationalId(request.getNationalId())) {
            throw new DuplicatePatientException(
                    "Patient with national ID " + request.getNationalId() + " already exists");
        }

        // Map DTO to entity
        Patient patient = patientMapper.toEntity(request);

        // Save and return
        Patient savedPatient = patientRepository.save(patient);
        log.info("Patient created with ID: {}", savedPatient.getPatientId());

        return patientMapper.toDTO(savedPatient);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PatientDTO> getPatientById(UUID patientId) {
        log.debug("Fetching patient by ID: {}", patientId);
        // Permissions will be checked in Subject 2
        return patientRepository.findById(patientId)
                .filter(patient -> !patient.getDeleted())
                .map(patientMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PatientDTO> getPatientByNationalId(String nationalId) {
        log.debug("Fetching patient by national ID: {}", nationalId);
        return patientRepository.findByNationalId(nationalId)
                .map(patientMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PatientDTO> getAllPatients(Pageable pageable) {
        log.debug("Fetching all patients with pagination - page: {}, size: {}", 
                pageable.getPageNumber(), pageable.getPageSize());
        // Permissions will be checked in Subject 2
        
        Page<Patient> patientPage = patientRepository.findByDeletedFalse(pageable);
        
        List<PatientDTO> content = patientPage.getContent().stream()
                .map(patientMapper::toDTO)
                .collect(Collectors.toList());
        
        return PageResponse.<PatientDTO>builder()
                .content(content)
                .page(patientPage.getNumber())
                .size(patientPage.getSize())
                .totalElements(patientPage.getTotalElements())
                .totalPages(patientPage.getTotalPages())
                .first(patientPage.isFirst())
                .last(patientPage.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PatientDTO> searchPatients(String searchTerm, Pageable pageable) {
        log.debug("Searching patients with term: {} - page: {}, size: {}", 
                searchTerm, pageable.getPageNumber(), pageable.getPageSize());
        
        Page<Patient> patientPage = patientRepository.searchPatients(searchTerm, pageable);
        
        List<PatientDTO> content = patientPage.getContent().stream()
                .map(patientMapper::toDTO)
                .collect(Collectors.toList());
        
        return PageResponse.<PatientDTO>builder()
                .content(content)
                .page(patientPage.getNumber())
                .size(patientPage.getSize())
                .totalElements(patientPage.getTotalElements())
                .totalPages(patientPage.getTotalPages())
                .first(patientPage.isFirst())
                .last(patientPage.isLast())
                .build();
    }

    @Override
    public PatientDTO updatePatient(UUID patientId, PatientDTO patientDTO) {
        log.info("Updating patient with ID: {}", patientId);
        // Permissions will be checked in Subject 2

        Patient existingPatient = patientRepository.findById(patientId)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found with ID: " + patientId));

        // Update fields
        // Business logic will be added in the specialized subject
        patientMapper.updateEntityFromDTO(patientDTO, existingPatient);

        Patient updatedPatient = patientRepository.save(existingPatient);
        log.info("Patient updated successfully: {}", patientId);

        return patientMapper.toDTO(updatedPatient);
    }

    @Override
    public void deletePatient(UUID patientId) {
        log.info("Deleting patient with ID: {} (soft delete)", patientId);
        // Permissions will be checked in Subject 2
        // Security will be reinforced in Subject 3

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found with ID: " + patientId));

        if (patient.getDeleted()) {
            throw new PatientNotFoundException("Patient already deleted with ID: " + patientId);
        }

        // Soft delete implementation
        patient.setDeleted(true);
        patient.setDeletedAt(LocalDateTime.now());
        patientRepository.save(patient);
        
        log.info("Patient soft deleted successfully: {}", patientId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(UUID patientId) {
        return patientRepository.findById(patientId)
                .map(patient -> !patient.getDeleted())
                .orElse(false);
    }
}

