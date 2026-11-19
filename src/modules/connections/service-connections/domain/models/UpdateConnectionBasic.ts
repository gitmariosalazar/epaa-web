export interface UpdateConnectionBasicRequest {
  connectionId: string;
  meterNumber?: string | null;
  photosFacade: File[];
  photosFacadeDescriptions?: string[];
  photosMeter: File[];
  photosMeterDescriptions?: string[];
}
