import type { SolicitudRepository, RejectPaymentDto } from '../../domain/repositories/SolicitudRepository';

export class RejectPaymentUseCase {
  private readonly repository: SolicitudRepository;

  constructor(repository: SolicitudRepository) {
    this.repository = repository;
  }

  async execute(dto: RejectPaymentDto): Promise<void> {
    if (!dto.invoiceId) {
      throw new Error('El ID de la factura es requerido');
    }
    if (!dto.adminId) {
      throw new Error('El ID del administrador es requerido');
    }
    if (!dto.reason || dto.reason.trim() === '') {
      throw new Error('El motivo de rechazo es requerido');
    }

    await this.repository.rejectPayment(dto);
  }
}
