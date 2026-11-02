export interface RouteConnection {
  idRutaAcometida: number;
  rutaId: number;
  acometidaId: string;
  ordenSecuencia: number;
  ladoCalle?: string;
  pisoDepartamento?: string;
  instruccionAcceso?: string;
  activo: boolean;
  cuenta?: string;
  numeroMedidor?: string;
  abonado?: string;
  direccion?: string;
  referencia?: string;
  latitud?: number;
  longitud?: number;
  consumoPromedio?: number;
}
