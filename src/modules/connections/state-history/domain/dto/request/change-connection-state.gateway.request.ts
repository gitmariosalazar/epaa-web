import { ApiProperty } from '@nestjs/swagger';

export class ChangeConnectionStateGatewayRequest {
  @ApiProperty({
    example: 'ACOM-00102',
    description: 'Unique identifier of the connection (acometida_id)',
    required: true,
    type: String,
  })
  connectionId!: string;

  @ApiProperty({
    example: 4,
    description: 'Target state ID from cat_estados_acometida (1 to 15)',
    required: true,
    type: Number,
  })
  newStateId!: number;

  @ApiProperty({
    example: 'Non-payment accumulated over 2 months',
    description: 'Operational justification or reason for state transition',
    required: true,
    type: String,
  })
  reason!: string;

  // Extracted internally from JWT token (request['user'].sub)
  userId?: string;

  @ApiProperty({
    example: 'WEB',
    description: 'Origin channel: WEB, APP_MOVIL, CUADRILLA, SISTEMA, INTEGRACION',
    required: false,
    enum: ['WEB', 'APP_MOVIL', 'CUADRILLA', 'SISTEMA', 'INTEGRACION', 'MIGRACION'],
    default: 'WEB',
  })
  origin?: string;

  @ApiProperty({
    example: 'OT-CORTE-2026-0045',
    description: 'Supporting administrative or work order document identifier',
    required: false,
    type: String,
  })
  supportDocument?: string;

  @ApiProperty({
    example: 'Se colocó tapón roscado y precinto #P-4421. Lectura: 450 m3',
    description: 'Technical notes or observations recorded by the crew/operator',
    required: false,
    type: String,
  })
  observations?: string;

  @ApiProperty({
    example: -0.180653,
    description: 'WGS84 Latitude coordinate captured during field event',
    required: false,
    type: Number,
  })
  latitude?: number;

  @ApiProperty({
    example: -78.467834,
    description: 'WGS84 Longitude coordinate captured during field event',
    required: false,
    type: Number,
  })
  longitude?: number;

  @ApiProperty({
    example: '2026-11-17T16:45:00.000Z',
    description: 'Effective physical timestamp when the event occurred in the field (defaults to now)',
    required: false,
    type: String,
  })
  effectiveDate?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Evidence photo or document (PDF, PNG, JPG, WEBP) to attach to this transition',
    required: false,
  })
  file?: unknown;
}
