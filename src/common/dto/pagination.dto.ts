import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsNumber } from "class-validator";
import { Transform } from "class-transformer";
import { IPaginationMeta, IPaginationResult } from "../utils/pagination";
export class PaginationDto {
  @ApiPropertyOptional({ type: Number, default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  page: number = 1;

  @ApiPropertyOptional({ type: Number, default: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  limit: number = 10;
}

export class PaginationResponseDto<T> implements IPaginationResult<T> {
  @ApiProperty({ isArray: true })
  data: T[];

  @ApiProperty()
  meta: IPaginationMeta;
}
