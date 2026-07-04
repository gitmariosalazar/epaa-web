// ── Pure validation helpers — SRP: only validates, no side effects ──────────
import type { WorkOrderForm } from './types';

interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/**
 * OCP: each step validates independently.
 * Adding a step 4 doesn't change existing logic.
 */
export const validateStep = (
  step: number,
  form: WorkOrderForm
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (step === 1) {
    if (!form.clientId.trim())
      errors.clientId = 'Busca por cédula o clave catastral y selecciona una acometida.';
    if (!form.clientName.trim())
      errors.clientName = 'No se ha seleccionado un cliente. Realiza una búsqueda.';
    if (!form.cadastralKey.trim())
      errors.cadastralKey = 'Selecciona una acometida de la tabla de resultados.';
  }

  if (step === 2) {
    if (!form.location.trim())
      errors.location = 'La dirección / lugar del trabajo es obligatoria.';
    if (!form.workTypeId)
      errors.workTypeId = 'Selecciona el tipo de trabajo.';
    if (!form.priorityId)
      errors.priorityId = 'Selecciona la prioridad.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
};
