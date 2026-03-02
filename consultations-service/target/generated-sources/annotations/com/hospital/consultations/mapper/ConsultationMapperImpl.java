package com.hospital.consultations.mapper;

import com.hospital.consultations.dto.ConsultationCreateRequest;
import com.hospital.consultations.dto.ConsultationDTO;
import com.hospital.consultations.model.Consultation;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-02T14:06:22+0000",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Oracle Corporation)"
)
@Component
public class ConsultationMapperImpl implements ConsultationMapper {

    @Override
    public ConsultationDTO toDTO(Consultation consultation) {
        if ( consultation == null ) {
            return null;
        }

        ConsultationDTO.ConsultationDTOBuilder consultationDTO = ConsultationDTO.builder();

        consultationDTO.consultationId( consultation.getConsultationId() );
        consultationDTO.patientId( consultation.getPatientId() );
        consultationDTO.userId( consultation.getUserId() );
        consultationDTO.date( consultation.getDate() );
        consultationDTO.type( consultation.getType() );
        consultationDTO.diagnostic( consultation.getDiagnostic() );

        return consultationDTO.build();
    }

    @Override
    public Consultation toEntity(ConsultationCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        Consultation.ConsultationBuilder consultation = Consultation.builder();

        consultation.patientId( request.getPatientId() );
        consultation.userId( request.getUserId() );
        consultation.date( request.getDate() );
        consultation.type( request.getType() );
        consultation.diagnostic( request.getDiagnostic() );

        return consultation.build();
    }

    @Override
    public void updateEntityFromDTO(ConsultationDTO dto, Consultation entity) {
        if ( dto == null ) {
            return;
        }

        entity.setConsultationId( dto.getConsultationId() );
        entity.setPatientId( dto.getPatientId() );
        entity.setUserId( dto.getUserId() );
        entity.setDate( dto.getDate() );
        entity.setType( dto.getType() );
        entity.setDiagnostic( dto.getDiagnostic() );
    }
}
