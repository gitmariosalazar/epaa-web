import { ApiProperty } from '@nestjs/swagger';

export class CurrentConnectionStateGatewayResponse {
  @ApiProperty({ example: 'ACOM-00102', description: 'Connection ID' })
  connectionId!: string;

  @ApiProperty({ example: 1, description: 'Current state ID from catalog' })
  stateId!: number;

  @ApiProperty({ example: 'ACTIVA', description: 'Current state name' })
  stateName!: string;

  @ApiProperty({ example: 'Servicio habilitado y facturación activa', description: 'Description' })
  description!: string;

  @ApiProperty({ example: true, description: 'Whether current state allows billing' })
  allowsBilling!: boolean;

  @ApiProperty({ example: true, description: 'Whether current state allows meter reading' })
  allowsReading!: boolean;

  @ApiProperty({ example: false, description: 'Whether current state requires inspection' })
  requiresInspection!: boolean;

  @ApiProperty({ example: true, description: 'Legacy boolean flag (public.acometida.estado)' })
  isActiveLegacy!: boolean;

  @ApiProperty({ example: '2026-11-17T16:50:00.000Z', nullable: true, description: 'Last state change timestamp' })
  lastChangedAt!: string | null;

  @ApiProperty({ example: 'Reconexión física completada', nullable: true, description: 'Last change reason' })
  lastReason!: string | null;

  @ApiProperty({ example: 'APP_MOVIL', nullable: true, description: 'Last change origin channel' })
  lastOrigin!: string | null;
}
