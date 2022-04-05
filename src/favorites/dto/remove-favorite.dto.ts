import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayMinSize, IsNumber } from 'class-validator';

export class removeFavoriteDTO {
  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  ids: number[];
}
