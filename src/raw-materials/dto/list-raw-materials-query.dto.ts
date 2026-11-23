import { IsIn, IsOptional } from 'class-validator';

// The query parameter we accept: /raw-materials?lowStock=true
export class ListRawMaterialsQueryDto {
  @IsOptional()
  @IsIn(['true', 'false'], { message: 'lowStock must be true or false.' })
  lowStock?: string;
}