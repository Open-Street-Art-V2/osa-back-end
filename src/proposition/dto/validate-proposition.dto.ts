import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';

export class ValidatePropDto {
  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  propositions: number[];
}
