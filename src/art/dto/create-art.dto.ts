import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsNumberString,
  IsString,
} from 'class-validator';

// class Geo {
//   @ApiProperty()
//   @IsNotEmpty()
//   @IsNumber()
//   latitude: number;

//   @ApiProperty()
//   @IsNotEmpty()
//   longitude: number;
// }

export class CreateArtDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  artist: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  latitude: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  longitude: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;

  /*@ApiProperty()  // TODO: On doit discuter la dessus
    @IsNotEmpty()
    geolocation: Geo;*/
}
