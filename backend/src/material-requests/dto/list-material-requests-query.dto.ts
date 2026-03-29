import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { IsIsoDateOnly } from './is-iso-date-only.decorator';
import { trimOptionalString } from './utils';

export class ListMaterialRequestsQueryDto {
  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  @IsString()
  @MaxLength(30)
  requestNumber?: string;

  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  @IsString()
  @MaxLength(100)
  requesterName?: string;

  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  @IsIsoDateOnly()
  requestDateFrom?: string;

  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  @IsIsoDateOnly()
  requestDateTo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  pageSize: number = 10;
}
