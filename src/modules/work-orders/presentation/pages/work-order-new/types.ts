// ── Domain types for the Create Work Order wizard ──────────────────────────

export interface WorkOrderForm {
  // Paso 1: Cliente
  clientId:    string;   // cédula / RUC
  clientName:  string;
  clientEmail: string;
  clientPhone: string;
  tipoPersona: 'NATURAL' | 'JURIDICA';

  // Paso 2: Detalle
  origin:       string;
  workTypeId:   number;
  priorityId:   number;
  cadastralKey: string;
  location:     string;
  description:  string;
  longitude:    string;
  latitude:     string;
}
