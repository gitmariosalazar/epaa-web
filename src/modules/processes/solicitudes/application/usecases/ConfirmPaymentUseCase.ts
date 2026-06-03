import type { SolicitudRepository, ConfirmPaymentDto } from '../../domain/repositories/SolicitudRepository';

export class ConfirmPaymentUseCase {
  private readonly repository: SolicitudRepository;

  constructor(repository: SolicitudRepository) {
    this.repository = repository;
  }

  async execute(dto: ConfirmPaymentDto): Promise<void> {
    if (!dto.invoiceId) {
      throw new Error('El ID de la factura es requerido');
    }
    if (!dto.paymentMethod || dto.paymentMethod.trim() === '') {
      throw new Error('El método de pago es requerido');
    }
    if (!dto.paymentReference || dto.paymentReference.trim() === '') {
      throw new Error('La referencia de pago es requerida');
    }
    if (!dto.collectorId) {
      throw new Error('El ID del recaudador es requerido');
    }

    await this.repository.confirmPayment(dto);
  }
}
