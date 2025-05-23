import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';


export class PaginationDto {

  @ApiProperty({
    default: 10,
    description: "How many rows do you need",
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({})
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  offset?: number;

}