import type { Tramite } from '@/modules/tramites/domain/models/Tramite';
import type { SolicitudForm } from '../../presentation/pages/solicitud-nueva/types';
import type { DocumentosMap } from '@/modules/tramites/domain/models/DocumentoAdjunto';
import { isLocationTramite } from '../../presentation/pages/solicitud-nueva/helpers';

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export class ValidateSolicitudStepUseCase {
  execute(
    step: number,
    form: SolicitudForm,
    tramite?: Tramite | null,
    documentos?: DocumentosMap
  ): ValidationResult {
    const errors: Record<string, string> = {};

    if (!tramite) {
      return { valid: false, errors: { general: 'El trámite no está cargado.' } };
    }

    if (step === 1) {
      const isInvalidValue = (val?: any): boolean => {
        if (val === undefined || val === null) return true;
        const str = String(val).trim().toLowerCase();
        return str === '' || str === 'no_asignado' || str === 'no asignado' || str === '0';
      };

      // 1. Validate Location if it is a location-based tramite
      if (isLocationTramite(tramite.categoria)) {
        if (isInvalidValue(form.detalles?.provinceId)) {
          errors.provinceId = 'Debe seleccionar una provincia válida.';
        }
        if (isInvalidValue(form.detalles?.cantonId)) {
          errors.cantonId = 'Debe seleccionar un cantón válido.';
        }
        if (isInvalidValue(form.detalles?.parishId)) {
          errors.parishId = 'Debe seleccionar una parroquia válida.';
        }
      }

      // 2. Validate dynamic fields based on category
      const cat = tramite.categoria;
      if (cat === 'nueva_acometida' || cat === 'alcantarillado') {
        if (!form.detalles?.barrio?.trim()) {
          errors.barrio = 'El barrio o sector es obligatorio.';
        }
        if (!form.detalles?.calle_principal?.trim()) {
          errors.calle_principal = 'La calle principal es obligatoria.';
        }
        if (!form.detalles?.tipo_uso) {
          errors.tipo_uso = 'Debe seleccionar el tipo de uso.';
        }
        if (!form.detalles?.diametro_solicitado) {
          errors.diametro_solicitado = 'Debe seleccionar el diámetro solicitado.';
        }
      } else if (cat === 'suspension') {
        if (!form.detalles?.tipo_suspension) {
          errors.tipo_suspension = 'Debe seleccionar el tipo de suspensión.';
        }
        if (form.detalles?.tipo_suspension === 'temporal' && !form.detalles?.tiempo_estimado?.trim()) {
          errors.tiempo_estimado = 'El tiempo estimado es obligatorio.';
        }
        if (!form.detalles?.motivo?.trim()) {
          errors.motivo = 'El motivo de la suspensión es obligatorio.';
        }
      }
    } else if (step === 2) {
      // Validate documents
      const docs = documentos || {};
      const requiredRequisitos = tramite.requisitos.filter((r) => r.obligatorio);
      
      requiredRequisitos.forEach((req) => {
        if (!docs[req.id]) {
          errors[req.id] = `El documento "${req.descripcion}" es obligatorio.`;
        }
      });
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }
}
