import { IsOptional, Matches } from 'class-validator';

// The query parameter we accept: /production-logs?productId=1
export class ListProductionLogsQueryDto {
  @IsOptional()
  @Matches(/^\d+$/, { message: 'productId must be a whole number.' })
  productId?: string;
}