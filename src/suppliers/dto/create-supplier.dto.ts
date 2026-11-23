import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

// Used for POST (create) and PUT (replace). PUT needs the complete record,
// so it uses the same rules as creating a new supplier.
export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  supplierName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  contactNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  address?: string;
}