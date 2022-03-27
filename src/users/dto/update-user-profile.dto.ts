import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserProfileDTO {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsAlpha()
  @MinLength(2)
  @MaxLength(25)
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsAlpha()
  @MinLength(2)
  @MaxLength(25)
  @IsOptional()
  firstname?: string;

  @ApiProperty()
  @MinLength(8)
  @MaxLength(25)
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsAlpha()
  @IsOptional()
  favoriteCity?: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @IsOptional()
  birthDate?: Date;
}
