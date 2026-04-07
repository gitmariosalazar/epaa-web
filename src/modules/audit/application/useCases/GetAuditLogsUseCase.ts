import type { AuditRepository } from '../../domain/repositories/AuditRepository';
import type { GetAuditLogsParams, AuditRegistroResponse } from '../../domain/models/AuditModels';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class GetAuditLogsUseCase {
  private readonly auditRepository: AuditRepository;

  constructor(auditRepository: AuditRepository) {
    this.auditRepository = auditRepository;
  }

  async execute(params: GetAuditLogsParams): Promise<ApiResponse<AuditRegistroResponse[]>> {
    return this.auditRepository.getAuditLogs(params);
  }
}
