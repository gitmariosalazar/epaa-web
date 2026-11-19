import { ApiProperty } from '@nestjs/swagger';

export class BulkChangeConnectionStateGatewayRequest {
  @ApiProperty({
    example: ['ACOM-00101', 'ACOM-00102', 'ACOM-00103'],
    description: 'Array of connection identifiers to transition simultaneously',
    required: true,
    type: [String],
  })
  connectionIds!: string[];

  @ApiProperty({
    example: 4,
    description: 'Target state ID from cat_estados_acometida for all connections',
    required: true,
    type: Number,
  })
  newStateId!: number;

  @ApiProperty({
    example: 'Campaign: Mass disconnection due to overdue bills > 3 months',
    description: 'Operational justification or campaign reference',
    required: true,
    type: String,
  })
  reason!: string;

  // Extracted internally from JWT token (request['user'].sub)
  userId?: string;

  @ApiProperty({
    example: 'SISTEMA',
    description: 'Origin channel: SISTEMA, WEB, INTEGRACION',
    required: false,
    type: String,
    default: 'SISTEMA',
  })
  origin?: string;

  @ApiProperty({
    example: 'CAMPAIGN-CUT-2026-11',
    description: 'Campaign resolution or administrative authorization reference',
    required: false,
    type: String,
  })
  supportDocument?: string;

  @ApiProperty({
    example: 'Automated batch disconnection campaign',
    description: 'Additional notes or comments',
    required: false,
    type: String,
  })
  observations?: string;
}
