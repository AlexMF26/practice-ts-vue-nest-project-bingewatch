import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdateItemDto {
  @ApiPropertyOptional({
    example: 8,
  })
  @Max(10)
  @Min(1)
  @IsInt()
  @IsOptional()
  public readonly rating?: number;

  @ApiPropertyOptional({
    example: -1,
  })
  @IsInt()
  @IsOptional()
  public readonly progress?: number;
}
