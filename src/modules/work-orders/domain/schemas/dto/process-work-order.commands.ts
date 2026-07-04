export interface CreateWorkOrderCommand {
  origin: string;
  workTypeId: number;
  priorityId: number;
  clientId: string;
  cadastralKey?: string;
  description?: string;
  location: string;
  longitude?: number | null;
  latitude?: number | null;
  createdByUserId: string;
  metadata?: string;
}

export interface AssignWorkOrderToCrewCommand {
  workOrderId: string;
  crewId: string;
  assignedByUserId: string;
  comment?: string;
}

export interface AssignWorkOrderToWorkerCommand {
  workOrderId: string;
  workerId: string;
  assignedByUserId: string;
  comment?: string;
}

export interface CreatePreparationInspectionCommand {
  workOrderId: string;
  crewId?: string | null;
  createdByUserId: string;
  passed: boolean;
  observations?: string;
}

export interface AddPreparationInspectionDetailCommand {
  workOrderId: string;
  inspectionId: string;
  code: string;
  passed: boolean;
  createdByUserId: string;
  comment?: string;
}

export interface AddWorkOrderMaterialCommand {
  workOrderId: string;
  materialId: number;
  quantity: number;
  unitCost: number;
  createdByUserId: string;
}

export interface AddAdditionalCostCommand {
  workOrderId: string;
  concept: string;
  quantity: number;
  unitCost: number;
  createdByUserId: string;
}

export interface AddWorkOrderAttachmentCommand {
  workOrderId: string;
  createdByUserId: string;
  files: File[];
}

export interface CreateQualityControlCommand {
  workOrderId: string;
  createdByUserId: string;
  approved: boolean;
  comments?: string;
}

export interface AddQualityControlDetailCommand {
  workOrderId: string;
  controlId: string;
  code: string;
  passed: boolean;
  createdByUserId: string;
  comment?: string;
}

export interface RegisterSatisfactionSurveyCommand {
  workOrderId: string;
  rating: number;
  createdByUserId: string;
  comments?: string;
}

// ─── Personal en campo () ───────────────────────────────────

export interface AddWorkerToWorkOrderCommand {
  workOrderId: string;
  workerId: string;
  roleId?: number | null;
  isResponsible?: boolean;
  assignedByUserId: string;
}

export interface RemoveWorkerFromWorkOrderCommand {
  workOrderId: string;
  workerId: string;
  removedByUserId: string;
}

// ─── Lotes (Batch) ─────────────────────────────────────────────────────────────

export interface WorkOrderMaterialItemCommand {
  materialId: number;
  quantity: number;
  unitCost: number;
  codigoMaterial?: string;
  nombreMaterial?: string;
}

export interface AddWorkOrderMaterialsBatchCommand {
  workOrderId: string;
  createdByUserId: string;
  materials: WorkOrderMaterialItemCommand[];
}

export interface AdditionalCostItemCommand {
  concept: string;
  quantity: number;
  unitCost: number;
}

export interface AddAdditionalCostsBatchCommand {
  workOrderId: string;
  createdByUserId: string;
  costs: AdditionalCostItemCommand[];
}

export interface WorkOrderWorkerItemCommand {
  workerId: string;
  roleId?: number | null;
  isResponsible?: boolean;
}

export interface AddWorkersBatchToWorkOrderCommand {
  workOrderId: string;
  assignedByUserId: string;
  workers: WorkOrderWorkerItemCommand[];
}
