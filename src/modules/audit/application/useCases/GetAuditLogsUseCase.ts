import type { AuditRepository } from '../../domain/repositories/AuditRepository';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import type {
  GetAuditLogsParams,
  AuditRegistroResponse
} from '../../domain/models/AuditModels';

export class GetAuditLogsUseCase {
  private readonly auditRepository: AuditRepository;

  constructor(auditRepository: AuditRepository) {
    this.auditRepository = auditRepository;
  }

  async execute(
    params: GetAuditLogsParams
  ): Promise<ApiResponse<AuditRegistroResponse[]>> {
    return this.auditRepository.getAuditLogs(params);
  }
}
