export class IncidentDashboardResponseDto {
  kpis_generales!: KpisGeneralesDto;
  por_estado!: DistribucionEstadoDto[];
  por_categoria!: DistribucionCategoriaDto[];
  por_origen_reporte!: DistribucionOrigenDto[];
  por_prioridad!: DistribucionPrioridadDto[];
  tendencia_ultimos_30_dias!: TendenciaDiariaDto[];
  atencion_inmediata!: IncidenteCriticoDto[];
}

export class KpisGeneralesDto {
  total_incidentes!: number;
  total_pendientes!: number;
  total_resueltos!: number;
  total_criticos_activos!: number;
  costo_reparacion_acumulado!: number;
  tiempo_promedio_resolucion_dias!: number;
}

export class DistribucionEstadoDto {
  estado!: string;
  cantidad!: number;
}

export class DistribucionCategoriaDto {
  categoria!: string;
  cantidad!: number;
  costo_total!: number;
}

export class DistribucionOrigenDto {
  origen!: string;
  cantidad!: number;
}

export class DistribucionPrioridadDto {
  prioridad!: string;
  cantidad!: number;
}

export class TendenciaDiariaDto {
  fecha!: string;
  cantidad_reportada!: number;
}

export class IncidenteCriticoDto {
  incident_code!: string;
  connection_id!: string;
  category!: string;
  type!: string;
  days_open!: number;
  latitude!: number | null;
  longitude!: number | null;
}
