import type { AuditRepository } from '../../domain/repositories/AuditRepository';
import type { GetSessionLogsParams, AuditSessionResponse } from '../../domain/models/AuditModels';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class GetSessionLogsUseCase {
  private readonly auditRepository: AuditRepository;

  constructor(auditRepository: AuditRepository) {
    this.auditRepository = auditRepository;
  }

  async execute(params: GetSessionLogsParams): Promise<ApiResponse<AuditSessionResponse[]>> {
    return this.auditRepository.getSessionLogs(params);
  }
}
