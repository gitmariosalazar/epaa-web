import type { SolicitudRepository, CreateInspectionInvoiceDto } from '../../domain/repositories/SolicitudRepository';

export class CreateInspectionInvoiceUseCase {
  private readonly solicitudRepository: SolicitudRepository;

  constructor(solicitudRepository: SolicitudRepository) {
    this.solicitudRepository = solicitudRepository;
  }

  async execute(dto: CreateInspectionInvoiceDto): Promise<void> {
    if (!dto.requestId) {
      throw new Error('El ID de la solicitud es requerido');
    }
    if (!dto.invoiceNumber || dto.invoiceNumber.trim() === '') {
      throw new Error('El número de factura es requerido');
    }
    if (dto.conceptId === undefined || dto.conceptId <= 0) {
      throw new Error('El ID del concepto es requerido');
    }
    if (dto.amount === undefined || dto.amount <= 0) {
      throw new Error('El monto debe ser mayor a cero');
    }
    if (!dto.expirationDate) {
      throw new Error('La fecha de vencimiento es requerida');
    }

    await this.solicitudRepository.createInspectionInvoice(dto);
  }
}
