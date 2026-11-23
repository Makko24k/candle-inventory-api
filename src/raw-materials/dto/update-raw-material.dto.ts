import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

// What the client may send to update a raw material (all fields optional)
export class UpdateRawMaterialDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  materialName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  unit?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  quantityInStock?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  reorderLevel?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  supplierId?: number;
}