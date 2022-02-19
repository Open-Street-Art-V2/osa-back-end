import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { CreateArtDto } from './create-art.dto';

export class UpdateArtDto extends PartialType(CreateArtDto) {
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(7)
  index: number;
}
