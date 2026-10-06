export interface PhotoInputDto {
  photoUrl: string;
  description?: string;
}

export interface UpdateSpecialReadingRequest {
  tipoAjusteId: number;
  justificacion: string;
  previousReading?: number | null;
  currentReading?: number | null;
  readingValue?: number | null;
  sewerRate?: number | null;
  novelty?: string | null;
  typeNoveltyReadingId?: number | null;
  cadastralKey?: string;
  averageConsumption?: number;

  /**
   * Fotos de evidencia (URLs en string o DTOs con photoUrl y descripción)
   */
  photos?: (string | PhotoInputDto)[];
  evidencePhotos?: (string | PhotoInputDto)[];
  images?: (string | PhotoInputDto)[];
}
