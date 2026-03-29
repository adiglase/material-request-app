import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateMaterialDetailDto } from './create-material-detail.dto';
import { IsIsoDateOnly } from './is-iso-date-only.decorator';
import { trimOptionalString, trimRequiredString } from './utils';

export class CreateMaterialRequestDto {
  @Transform(({ value }) => trimRequiredString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  requestNumber: string;

  @IsIsoDateOnly()
  requestDate: string;

  @Transform(({ value }) => trimRequiredString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  requesterName: string;

  @Transform(({ value }) => trimRequiredString(value))
  @IsString()
  @IsNotEmpty()
  purpose: string;

  @Transform(({ value }) => trimOptionalString(value))
  @IsOptional()
  @IsString()
  notes?: string;

  // Reject early if material details is not an array os is empty
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateMaterialDetailDto)
  materialDetails: CreateMaterialDetailDto[];
}
