import { ApiProperty } from '@nestjs/swagger';

export class AllowedTransitionOptionGatewayResponse {
  @ApiProperty({ example: 4, description: 'Target state ID' })
  targetStateId!: number;

  @ApiProperty({ example: 'CORTADA_POR_MORA', description: 'Target state catalog name' })
  targetStateName!: string;

  @ApiProperty({
    example: 'ALLOWED',
    enum: ['ALLOWED', 'RESTRICTED', 'FORBIDDEN'],
    description: 'Transition status in matrix: ALLOWED, RESTRICTED, FORBIDDEN',
  })
  status!: 'ALLOWED' | 'RESTRICTED' | 'FORBIDDEN';

  @ApiProperty({
    example: 'Corte coercitivo por morosidad acumulada',
    description: 'Operational justification or rule note',
    required: false,
  })
  note?: string;
}

export class AllowedTransitionsGatewayResponse {
  @ApiProperty({ example: '14-293', description: 'Connection ID' })
  connectionId!: string;

  @ApiProperty({ example: 1, description: 'Current state ID or null if unassigned', nullable: true })
  currentStateId!: number | null;

  @ApiProperty({ example: 'ACTIVA', description: 'Current state name' })
  currentStateName!: string;

  @ApiProperty({
    type: [AllowedTransitionOptionGatewayResponse],
    description: 'Permissible target states according to the official 15x15 transition matrix',
  })
  allowedTransitions!: AllowedTransitionOptionGatewayResponse[];
}
