import { ApiProperty } from '@nestjs/swagger';

export class StateHistoryGatewayResponse {
  @ApiProperty({ example: 104523, description: 'Unique ledger history ID' })
  historialId!: number;

  @ApiProperty({ example: 'ACOM-00102', description: 'Connection identifier' })
  connectionId!: string;

  @ApiProperty({ example: 1, nullable: true, description: 'Previous state ID' })
  previousStateId!: number | null;

  @ApiProperty({ example: 'ACTIVA', nullable: true, description: 'Previous state name' })
  previousStateName!: string | null;

  @ApiProperty({ example: 4, description: 'New state ID' })
  newStateId!: number;

  @ApiProperty({ example: 'CORTADA_POR_MORA', description: 'New state name' })
  newStateName!: string;

  @ApiProperty({ example: true, description: 'Whether this state allows billing' })
  allowsBilling!: boolean;

  @ApiProperty({ example: true, description: 'Whether this state allows meter reading' })
  allowsReading!: boolean;

  @ApiProperty({ example: false, description: 'Whether this state requires field inspection' })
  requiresInspection!: boolean;

  @ApiProperty({ example: '2026-11-17T16:50:00.000Z', description: 'Record insertion timestamp' })
  changeDate!: string;

  @ApiProperty({ example: '2026-11-17T16:45:00.000Z', description: 'Physical event effective timestamp' })
  effectiveDate!: string;

  @ApiProperty({ example: 'Non-payment over 2 months', nullable: true, description: 'Reason' })
  reason!: string | null;

  @ApiProperty({ example: 'OT-CORTE-2026-0045', nullable: true, description: 'Supporting document' })
  supportDocument!: string | null;

  @ApiProperty({ example: 'Tapón roscado colocado', nullable: true, description: 'Observations' })
  observations!: string | null;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'User UUID' })
  userId!: string;

  @ApiProperty({ example: 'tecnico@epaa.gob.ec', nullable: true, description: 'User email' })
  userEmail!: string | null;

  @ApiProperty({ example: 'Carlos Mendoza', nullable: true, description: 'User full name' })
  userFullName!: string | null;

  @ApiProperty({ example: 'APP_MOVIL', description: 'Origin channel' })
  origin!: string;

  @ApiProperty({ example: '192.168.1.100', nullable: true, description: 'Client IP' })
  ipAddress!: string | null;

  @ApiProperty({ example: 'ZEBRA-TC26-UUID-4421', nullable: true, description: 'Device ID' })
  deviceId!: string | null;

  @ApiProperty({ example: -0.180653, nullable: true, description: 'Latitude' })
  latitude!: number | null;

  @ApiProperty({ example: -78.467834, nullable: true, description: 'Longitude' })
  longitude!: number | null;

  @ApiProperty({ example: false, description: 'Whether this record is an operational reversal' })
  isReversal!: boolean;

  @ApiProperty({ example: null, nullable: true, description: 'Origin history ID if reversal' })
  originHistoryId!: number | null;

  @ApiProperty({ example: '2026-11-17T16:50:00.000Z', description: 'Creation timestamp' })
  createdAt!: string;
}

export class BulkStateChangeGatewayResponse {
  @ApiProperty({ example: 3, description: 'Total connections requested for update' })
  totalRequested!: number;

  @ApiProperty({ example: 3, description: 'Total connections successfully updated' })
  totalUpdated!: number;

  @ApiProperty({ example: 4, description: 'New state ID applied' })
  newStateId!: number;

  @ApiProperty({ example: 'CORTADA_POR_MORA', description: 'New state name applied' })
  newStateName!: string;

  @ApiProperty({ example: ['ACOM-00101', 'ACOM-00102'], description: 'List of updated connection IDs' })
  updatedConnectionIds!: string[];

  @ApiProperty({
    example: [],
    description: 'List of connection IDs that failed with error messages',
  })
  failedConnectionIds!: Array<{ connectionId: string; errorMessage: string }>;
}
