import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { CreateWorkOrderCommand } from '../../domain/schemas/dto/process-work-order.commands';
import type { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';
import { EVIDENCE_STAGES } from '../../domain/constants/evidence-stage';
import { CreateWorkOrderUseCase } from './CreateWorkOrderUseCase';
import { AddWorkOrderAttachmentUseCase } from './AddWorkOrderAttachmentUseCase';

export type CreateWorkOrderWithEvidenceCommand = Omit<
  CreateWorkOrderCommand,
  'images'
> & { evidenceFiles?: File[] };

export interface CreateWorkOrderWithEvidenceResult {
  workOrder: ProcessWorkOrderResponse | null;
  evidenceUploaded: boolean;
  evidenceError?: string;
}

/**
 * Crea la orden y luego sube las evidencias iniciales (REPORTE_INICIAL).
 * Un fallo al subir archivos no invalida la orden ya creada: se reporta en el resultado.
 */
export class CreateWorkOrderWithEvidenceUseCase {
  private readonly createWorkOrder: CreateWorkOrderUseCase;
  private readonly addAttachment: AddWorkOrderAttachmentUseCase;

  constructor(repository: ProcessWorkOrderRepository) {
    this.createWorkOrder = new CreateWorkOrderUseCase(repository);
    this.addAttachment = new AddWorkOrderAttachmentUseCase(repository);
  }

  async execute(
    command: CreateWorkOrderWithEvidenceCommand,
  ): Promise<CreateWorkOrderWithEvidenceResult> {
    const { evidenceFiles = [], ...orderCommand } = command;
    const workOrder = await this.createWorkOrder.execute(orderCommand);

    if (evidenceFiles.length === 0) {
      return { workOrder, evidenceUploaded: true };
    }

    if (!workOrder?.workOrderId) {
      return {
        workOrder,
        evidenceUploaded: false,
        evidenceError: 'No se obtuvo el ID de la orden para adjuntar evidencias.',
      };
    }

    try {
      await this.addAttachment.execute({
        workOrderId: workOrder.workOrderId,
        createdByUserId: command.createdByUserId,
        files: evidenceFiles,
        evidenceStageCode: EVIDENCE_STAGES.INITIAL_REPORT,
      });
      return { workOrder, evidenceUploaded: true };
    } catch (error) {
      return {
        workOrder,
        evidenceUploaded: false,
        evidenceError:
          error instanceof Error ? error.message : 'Error al subir las evidencias.',
      };
    }
  }
}
