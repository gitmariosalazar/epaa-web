import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import type { MapRouteFeatureCollection } from '../../domain/models/map-geojson';
import type { GetMapGeojsonByDayAndByUser } from '../../domain/repositories/GetMapGeojsonByDayAndByUser';

export class GetMapGeojsonByDayAndByUserImpl implements GetMapGeojsonByDayAndByUser {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }
  async getMapGeojsonByDayAndByUser(
    date: string,
    userId?: string
  ): Promise<MapRouteFeatureCollection> {
    // 1. La ruta base solo lleva el date (Path parameter)
    let path = `/Readings/get-map-geojson-by-day-and-by-user/${date}`;

    // 2. Si hay userId, lo agregamos como Query parameter
    if (userId) {
      path += `?userId=${userId}`;
    }

    const response =
      await this.client.get<ApiResponse<MapRouteFeatureCollection>>(path);

    // Tip extra: Recuerda quitar el console.log antes de enviar a producción :)
    // console.log(response.data.data);

    return response.data.data;
  }
}
