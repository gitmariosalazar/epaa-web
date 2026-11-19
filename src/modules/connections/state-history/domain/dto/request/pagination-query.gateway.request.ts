import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryGatewayRequest {
  @ApiProperty({
    example: 50,
    description: 'Number of items per page (default: 50, max: 200)',
    required: false,
    type: Number,
    default: 50,
  })
  limit?: number;

  @ApiProperty({
    example: 0,
    description: 'Pagination offset (default: 0)',
    required: false,
    type: Number,
    default: 0,
  })
  offset?: number;
}
