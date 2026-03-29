import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateMaterialDetailDto } from './create-material-detail.dto';
import { trimOptionalString, trimRequiredString } from './utils';

export class CreateMaterialRequestDto {
  @Transform(({ value }) => trimRequiredString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  requestNumber: string;

  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'requestDate must be in YYYY-MM-DD format',
  })
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

  // A material request without detail rows is incomplete, so reject it early.
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateMaterialDetailDto)
  materialDetails: CreateMaterialDetailDto[];
}
