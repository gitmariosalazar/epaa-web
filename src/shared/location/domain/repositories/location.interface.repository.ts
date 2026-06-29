import type { CenterLocationResponse } from '../schemas/dto/response/location.response';

export interface ILocationRepository {
  getCenterLLocationMapIncidents(): Promise<CenterLocationResponse>;
}
