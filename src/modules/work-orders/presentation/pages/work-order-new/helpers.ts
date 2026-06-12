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
      errors.clientId = 'Ingresa y busca la cédula o RUC del cliente.';
    if (!form.clientName.trim())
      errors.clientName = 'El cliente no fue encontrado. Realiza una búsqueda válida.';
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
