import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserProfileDTO {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
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
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @IsOptional()
  birthDate?: Date;
}
