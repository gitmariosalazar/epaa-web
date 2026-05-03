export interface AuditSector {
  auditId: number;
  readingMonth: Date; // mesLectura
  sectorId: number;
  expectedTotal: number; // totalEsperado
  completedTotal: number; // totalCompletadas
  pendingTotal: number; // totalPendientes
  progressPercentage: number; // avancePorcentaje
  isComplete: boolean; // completo
  closureDate: Date | null; // fechaCierre
  supervisorId: string | null;
  observations: string | null; // observaciones
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditSectorHistory {
  readingMonth: Date;
  sectorId: number;
  expectedTotal: number;
  completedTotal: number;
  progressPercentage: number;
  isComplete: boolean;
  closureDate: Date | null;
}

export interface CloseAuditSector {
  auditId: number;
  sectorId: number;
  readingMonth: Date;
  isComplete: boolean;
  closureDate: Date;
  supervisorId: string;
  observations: string | null;
}

export interface InitializeAudit {
  message: string;
  period: string;
  sectorsGenerated: number;
}
