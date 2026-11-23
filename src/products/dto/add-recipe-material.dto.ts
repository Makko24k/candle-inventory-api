import { IsInt, IsNumber, IsPositive, Min } from 'class-validator';

// What the client sends to add a raw material to a product's recipe
export class AddRecipeMaterialDto {
  @IsInt()
  @Min(1)
  materialId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive() // Lab 04 CHECK: QuantityNeeded > 0
  quantityNeeded: number;
}