import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

// What the client must send to create a candle product
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  productName: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  scent?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0) // Lab 04 CHECK: Price >= 0
  price: number;

  @IsOptional()
  @IsInt()
  @Min(0) // Lab 04 CHECK: QuantityInStock >= 0
  quantityInStock?: number;
}