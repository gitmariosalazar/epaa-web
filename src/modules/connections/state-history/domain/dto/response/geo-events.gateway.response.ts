import { ApiProperty } from '@nestjs/swagger';

export class GeoJSONFeatureProperties {
  @ApiProperty({ example: 104523, description: 'Historial ID' })
  historialId!: number;

  @ApiProperty({ example: '14-293', description: 'Connection ID' })
  connectionId!: string;

  @ApiProperty({ example: 10, nullable: true, description: 'Sector ID' })
  sector!: number | null;

  @ApiProperty({ example: 4, description: 'State ID' })
  stateId!: number;

  @ApiProperty({ example: 'CORTADA_POR_MORA', description: 'State catalog name' })
  stateName!: string;

  @ApiProperty({ example: '2026-11-17T16:45:00.000Z', description: 'Effective physical timestamp' })
  effectiveDate!: string;

  @ApiProperty({ example: 'Corte por mora acumulada', nullable: true, description: 'Reason for transition' })
  reason!: string | null;

  @ApiProperty({ example: 'OT-CORTE-2026-0312', nullable: true, description: 'Support document' })
  supportDocument!: string | null;
}

export class GeoJSONFeatureGatewayResponse {
  @ApiProperty({ example: 'Feature', description: 'GeoJSON Feature type' })
  type!: 'Feature';

  @ApiProperty({
    example: { type: 'Point', coordinates: [-78.467834, -0.180653] },
    description: 'PostGIS GeoJSON Geometry Point (WGS84)',
  })
  geometry!: Record<string, unknown>;

  @ApiProperty({ type: GeoJSONFeatureProperties, description: 'Feature properties' })
  properties!: GeoJSONFeatureProperties;
}

export class StateEventsGeoJSONGatewayResponse {
  @ApiProperty({ example: 'FeatureCollection', description: 'GeoJSON FeatureCollection type' })
  type!: 'FeatureCollection';

  @ApiProperty({ example: 42, description: 'Total features matching query' })
  totalFeatures!: number;

  @ApiProperty({ type: [GeoJSONFeatureGatewayResponse], description: 'List of GeoJSON Point features' })
  features!: GeoJSONFeatureGatewayResponse[];
}
