package com.hospital.consultations.service.impl;

import com.hospital.consultations.client.PatientClient;
import com.hospital.consultations.dto.ConsultationCreateRequest;
import com.hospital.consultations.dto.ConsultationDTO;
import com.hospital.consultations.exception.ConsultationNotFoundException;
import com.hospital.consultations.exception.InvalidConsultationException;
import com.hospital.consultations.mapper.ConsultationMapper;
import com.hospital.consultations.model.Consultation;
import com.hospital.consultations.repository.ConsultationRepository;
import com.hospital.consultations.service.ConsultationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                  CONSULTATION SERVICE IMPLEMENTATION                          ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS CLASS EXISTS:                                                      ║
 * ║  Implements the business logic for consultation operations.                   ║
 * ║                                                                              ║
 * ║  This service is mandatory according to the Kit Commun                      ║
 * ║  @Transactional: Ensures database operations are atomic                      ║
 * ║                                                                              ║
 * ║  IMPORTANT: Never log diagnostic data in clear text!                         ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ConsultationServiceImpl implements ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final ConsultationMapper consultationMapper;
    private final PatientClient patientClient;

    @Override
    public ConsultationDTO createConsultation(ConsultationCreateRequest request) {
        log.info("Creating new consultation for patient: {}", request.getPatientId());
        // IMPORTANT: Never log diagnostic in clear text!

        // Validate patient exists
        Boolean patientExists = patientClient.checkPatientExists(request.getPatientId());
        if (patientExists == null || !patientExists) {
            throw new InvalidConsultationException(
                    "Patient not found with ID: " + request.getPatientId());
        }

        // Map DTO to entity
        Consultation consultation = consultationMapper.toEntity(request);

        // Save and return
        Consultation savedConsultation = consultationRepository.save(consultation);
        log.info("Consultation created with ID: {}", savedConsultation.getConsultationId());

        return consultationMapper.toDTO(savedConsultation);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ConsultationDTO> getConsultationById(UUID consultationId) {
        log.debug("Fetching consultation by ID: {}", consultationId);
        return consultationRepository.findById(consultationId)
                .map(consultationMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConsultationDTO> getPatientHistory(UUID patientId) {
        log.info("Fetching consultation history for patient: {}", patientId);
        // This functionality is mandatory according to the Kit Commun
        return consultationRepository.findByPatientIdOrderByDateDesc(patientId).stream()
                .map(consultationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ConsultationDTO updateConsultation(UUID consultationId, ConsultationDTO consultationDTO) {
        log.info("Updating consultation: {}", consultationId);
        // IMPORTANT: Never log diagnostic in clear text!

        Consultation existingConsultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new ConsultationNotFoundException(
                        "Consultation not found with ID: " + consultationId));

        // Update fields
        consultationMapper.updateEntityFromDTO(consultationDTO, existingConsultation);

        Consultation updatedConsultation = consultationRepository.save(existingConsultation);
        log.info("Consultation updated successfully: {}", consultationId);

        return consultationMapper.toDTO(updatedConsultation);
    }

    public List<ConsultationDTO> getAll() {
        return consultationRepository.findAll()
                .stream()
                .map(consultationMapper::toDTO)
                .toList();
    }

}
