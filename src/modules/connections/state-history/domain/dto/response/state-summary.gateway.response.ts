import { ApiProperty } from '@nestjs/swagger';

export class StateSummaryGatewayResponse {
  @ApiProperty({ example: 1, description: 'Catalog State ID' })
  stateId!: number;

  @ApiProperty({ example: 'ACTIVA', description: 'State name' })
  stateName!: string;

  @ApiProperty({ example: 'Servicio habilitado', description: 'Description' })
  description!: string;

  @ApiProperty({ example: 15974, description: 'Total connections currently in this state' })
  totalConnections!: number;

  @ApiProperty({ example: 94.91, description: 'Percentage of total network connections' })
  percentage!: number;

  @ApiProperty({ example: true, description: 'Allows billing' })
  allowsBilling!: boolean;

  @ApiProperty({ example: true, description: 'Allows reading' })
  allowsReading!: boolean;

  @ApiProperty({ example: false, description: 'Requires inspection' })
  requiresInspection!: boolean;
}
