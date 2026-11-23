import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

// What the client must send to create a raw material
export class CreateRawMaterialDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  materialName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  unit: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0) // Lab 04 CHECK: QuantityInStock >= 0
  quantityInStock: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  reorderLevel: number;

  @IsInt()
  @Min(1)
  supplierId: number;
}