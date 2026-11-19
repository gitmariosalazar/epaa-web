import { ApiProperty } from '@nestjs/swagger';

export class FilterStateHistoryGatewayRequest {
  @ApiProperty({
    example: 'ACOM-00102',
    description: 'Filter by connection identifier',
    required: false,
    type: String,
  })
  connectionId?: string;

  @ApiProperty({
    example: 4,
    description: 'Filter by new state ID reached',
    required: false,
    type: Number,
  })
  stateId?: number;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Filter by user/technician ID who triggered the transition',
    required: false,
    type: String,
  })
  userId?: string;

  @ApiProperty({
    example: 'APP_MOVIL',
    description: 'Filter by execution channel: WEB, APP_MOVIL, CUADRILLA, SISTEMA, INTEGRACION',
    required: false,
    enum: ['WEB', 'APP_MOVIL', 'CUADRILLA', 'SISTEMA', 'INTEGRACION', 'MIGRACION'],
  })
  origin?: string;

  @ApiProperty({
    example: '2026-01-01T00:00:00.000Z',
    description: 'Start date range for effective date (ISO-8601)',
    required: false,
    type: String,
  })
  startDate?: string;

  @ApiProperty({
    example: '2026-12-31T23:59:59.000Z',
    description: 'End date range for effective date (ISO-8601)',
    required: false,
    type: String,
  })
  endDate?: string;

  @ApiProperty({
    example: false,
    description: 'Filter specifically for reversal events (true) or normal transitions (false)',
    required: false,
    type: Boolean,
  })
  isReversal?: boolean;

  @ApiProperty({
    example: 50,
    description: 'Number of records per page (default: 50, max: 200)',
    required: false,
    type: Number,
    default: 50,
  })
  limit?: number;

  @ApiProperty({
    example: 0,
    description: 'Offset / pagination offset (default: 0)',
    required: false,
    type: Number,
    default: 0,
  })
  offset?: number;
}
