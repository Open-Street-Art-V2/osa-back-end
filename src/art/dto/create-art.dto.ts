import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
  @IsNotEmpty()
  @IsString()
  artist: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  /*@ApiProperty()  // TODO: On doit discuter la dessus
    @IsNotEmpty()
    geolocation: Geo;*/
}
