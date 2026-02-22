package com.hospital.consultations.mapper;

import com.hospital.consultations.dto.ConsultationCreateRequest;
import com.hospital.consultations.dto.ConsultationDTO;
import com.hospital.consultations.model.Consultation;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                        CONSULTATION MAPPER                                    ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS INTERFACE EXISTS:                                                 ║
 * ║  MapStruct automatically generates code to map between entities and DTOs.     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ConsultationMapper {

    ConsultationDTO toDTO(Consultation consultation);

    Consultation toEntity(ConsultationCreateRequest request);

    void updateEntityFromDTO(ConsultationDTO dto, @MappingTarget Consultation entity);
}
