import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { UpdateSpecialReadingRequest } from '../../domain/dto/request/UpdateSpecialReadingRequest';
import type { ReadingResponse } from '../../domain/models/Reading';
import type { UpdateSpecialReadingRepository } from '../../domain/repositories/UpdateSpecialReadingRepository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export class UpdateSpecialReadingRepositoryImpl implements UpdateSpecialReadingRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async updateSpecialReading(
    readingId: number,
    request: UpdateSpecialReadingRequest
  ): Promise<ReadingResponse | null> {
    const rawPhotos = request.photos ?? request.evidencePhotos ?? request.images ?? [];

    const formData = new FormData();
    formData.append('tipoAjusteId', String(request.tipoAjusteId));
    formData.append('justificacion', request.justificacion);

    if (request.previousReading !== undefined && request.previousReading !== null) {
      formData.append('previousReading', String(request.previousReading));
    }
    if (request.currentReading !== undefined && request.currentReading !== null) {
      formData.append('currentReading', String(request.currentReading));
    }
    if (request.cadastralKey) {
      formData.append('cadastralKey', request.cadastralKey);
    }
    if (request.averageConsumption !== undefined && request.averageConsumption !== null) {
      formData.append('averageConsumption', String(request.averageConsumption));
    }

    const existingPhotos: any[] = [];
    let imageCounter = 1;

    for (const item of rawPhotos) {
      const url = typeof item === 'string' ? item : item.photoUrl;
      const desc = typeof item === 'string' ? undefined : item.description;

      if (url && url.startsWith('data:image/')) {
        const ext = url.substring(url.indexOf('/') + 1, url.indexOf(';')) || 'jpg';
        const filename = `evidence_${readingId}_${Date.now()}_${imageCounter++}.${ext}`;
        const file = dataURLtoFile(url, filename);
        formData.append('images', file, filename);
        if (desc) {
          formData.append('description', desc);
        }
      } else if (url) {
        existingPhotos.push(typeof item === 'string' ? { photoUrl: item } : item);
      }
    }

    if (existingPhotos.length > 0) {
      formData.append('photos', JSON.stringify(existingPhotos));
    }

    const response = await this.client.put<ApiResponse<ReadingResponse>>(
      `/Readings/update-special-reading/${readingId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  }
}
