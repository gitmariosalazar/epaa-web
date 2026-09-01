export interface MeterPrevious {
  numero_medidor: string;
  ultima_lectura: number;
  fecha_ultima_lectura: string | Date;
}

export interface MeterNew {
  numero_medidor: string;
  lectura_anterior: number;
  lectura_actual: number;
  fecha_ultima_lectura: string | Date;
}

export interface MeterChangeDetail {
  clave_catastral: string;
  numero_medidor: string;
  serie: string;
  ubicacion: string;
  observaciones: string;
  medidor_anterior: MeterPrevious;
  medidor_nuevo: MeterNew;
  user_id?: string;
}

export interface ChangeMeterRequest {
  connectionId: string;
  changeDetail: MeterChangeDetail;
  images?: File[];
  imageDescriptions?: string[];
}
