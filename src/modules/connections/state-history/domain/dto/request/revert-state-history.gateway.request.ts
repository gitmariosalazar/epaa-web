import { ApiProperty } from '@nestjs/swagger';

export class RevertStateHistoryGatewayRequest {
  @ApiProperty({
    example: 5001,
    description: 'Unique ID of the erroneous history record (historial_id) to revert',
    required: true,
    type: Number,
  })
  historialId!: number;

  @ApiProperty({
    example: 'Crew mistakenly cut the wrong neighbor property. Account is fully paid.',
    description: 'Detailed operational reason justifying the reversal',
    required: true,
    type: String,
  })
  reason!: string;

  // Extracted internally from JWT token (request['user'].sub)
  userId?: string;

  @ApiProperty({
    example: 'EXP-REVERSO-2026-0012',
    description: 'Administrative approval file or supervisor resolution identifier',
    required: false,
    type: String,
  })
  supportDocument?: string;

  @ApiProperty({
    example: 'Restored service immediately. Field supervisor confirmed correction.',
    description: 'Supervisor audit comments',
    required: false,
    type: String,
  })
  observations?: string;

  @ApiProperty({
    example: 'WEB',
    description: 'Origin channel: WEB, APP_MOVIL, SISTEMA',
    required: false,
    type: String,
    default: 'WEB',
  })
  origin?: string;

  @ApiProperty({
    example: -0.180653,
    description: 'WGS84 Latitude',
    required: false,
    type: Number,
  })
  latitude?: number;

  @ApiProperty({
    example: -78.467834,
    description: 'WGS84 Longitude',
    required: false,
    type: Number,
  })
  longitude?: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Supporting supervisor resolution or evidence file (PDF, JPG, PNG)',
    required: false,
  })
  file?: unknown;
}
