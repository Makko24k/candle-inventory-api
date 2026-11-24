import { IsInt, IsISO8601, Matches, Min } from 'class-validator';

// What the client sends to record a production batch.
// userId is NOT here: the server takes it from the login token.
export class CreateProductionLogDto {
  @IsInt()
  @Min(1)
  productId: number;

  @IsInt()
  @Min(1) // Lab 04 CHECK: QuantityProduced > 0
  quantityProduced: number;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateProduced must be in YYYY-MM-DD format.',
  })
  @IsISO8601({ strict: true }, { message: 'dateProduced must be a real date.' })
  dateProduced: string;
}