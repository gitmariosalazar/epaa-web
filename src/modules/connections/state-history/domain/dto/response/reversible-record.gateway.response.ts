import { ApiProperty } from '@nestjs/swagger';
import { StateHistoryGatewayResponse } from './state-history.gateway.response';

export class ReversibleRecordGatewayResponse {
  @ApiProperty({ example: '14-293', description: 'Connection ID' })
  connectionId!: string;

  @ApiProperty({ example: true, description: 'True if there is an active transition eligible for reversal' })
  isReversible!: boolean;

  @ApiProperty({
    example: 'Active state transition is eligible for reversal.',
    description: 'Human-readable explanation of eligibility or reason why reversal is blocked',
  })
  message!: string;

  @ApiProperty({
    type: StateHistoryGatewayResponse,
    nullable: true,
    description: 'The specific state transition record that can be reverted, or null if ineligible',
  })
  record!: StateHistoryGatewayResponse | null;
}
