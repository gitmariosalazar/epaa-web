import type { SolicitudRepository } from '../../domain/repositories/SolicitudRepository';

export class UploadInspectionInvoiceReceiptUseCase {
  private readonly repository: SolicitudRepository;

  constructor(repository: SolicitudRepository) {
    this.repository = repository;
  }

  async execute(invoiceId: string, file: File): Promise<boolean> {
    if (!invoiceId) throw new Error('El ID de la factura es requerido');
    if (!file) throw new Error('El archivo es requerido');

    return await this.repository.uploadInspectionInvoiceReceipt(
      invoiceId,
      file
    );
  }
}
