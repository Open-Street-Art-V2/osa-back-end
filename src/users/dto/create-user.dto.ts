import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(8)
  @MaxLength(25)
  password: string;

  @ApiProperty()
  @IsAlpha()
  @MinLength(2)
  @MaxLength(25)
  name: string;

  @ApiProperty()
  @IsAlpha()
  @MinLength(2)
  @MaxLength(25)
  firstname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsAlpha()
  @IsOptional()
  favoriteCity?: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  birthDate: Date;
}
