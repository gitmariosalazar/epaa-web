/**
 * Sincroniza evidencias generadas en el paso previo (p. ej. fotos de la
 * resolución del incidente) hacia los adjuntos de la OT.
 *
 *  - SRP: sólo convierte y delega la subida.
 *  - DIP: depende de la abstracción `AttachmentUploader`, no del repositorio.
 */
import type { AddWorkOrderAttachmentCommand } from '../../domain/schemas/dto/process-work-order.commands';
import { EVIDENCE_STAGES, type EvidenceStageCode } from '../../domain/constants/evidence-stage';

export interface AttachmentUploader {
  execute(command: AddWorkOrderAttachmentCommand): Promise<unknown>;
}

/** Convierte un data URL (base64) en `File`. */
export const dataUrlToFile = (dataUrl: string, filename: string): File => {
  const [header, base64 = ''] = dataUrl.split(',');
  const mime = /data:(.*?);/.exec(header)?.[1] ?? 'image/jpeg';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], filename, { type: mime });
};

export interface SyncEvidenceParams {
  workOrderId: string;
  userId: string;
  dataUrls: string[];
  prefix?: string;
  evidenceStageCode?: EvidenceStageCode;
}

/** Sube las imágenes como evidencias de la OT. Devuelve cuántas se enviaron. */
export const syncEvidenceToWorkOrder = async (
  uploader: AttachmentUploader,
  {
    workOrderId,
    userId,
    dataUrls,
    prefix = 'resolucion_incidente',
    evidenceStageCode = EVIDENCE_STAGES.WORK_COMPLETED,
  }: SyncEvidenceParams
): Promise<number> => {
  if (!dataUrls.length) return 0;
  const stamp = Date.now();
  const files = dataUrls.map((url, i) => dataUrlToFile(url, `${prefix}_${stamp}_${i + 1}.jpg`));
  await uploader.execute({
    workOrderId,
    createdByUserId: userId,
    files,
    evidenceStageCode,
  });
  return files.length;
};
