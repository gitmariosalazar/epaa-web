import { ApiProperty } from '@nestjs/swagger';

export class StateCatalogGatewayResponse {
  @ApiProperty({ example: 1, description: 'Catalog State ID (1..15)' })
  stateId!: number;

  @ApiProperty({ example: 'ACTIVA', description: 'Canonical state name' })
  name!: string;

  @ApiProperty({ example: 'Servicio habilitado y facturación activa', description: 'Operational description' })
  description!: string;

  @ApiProperty({ example: true, description: 'Whether billing is allowed in this state' })
  allowsBilling!: boolean;

  @ApiProperty({ example: false, description: 'Whether transitions require physical field inspection' })
  requiresInspection!: boolean;

  @ApiProperty({ example: true, description: 'Whether meter reading is allowed in this state' })
  allowsReading!: boolean;
}
