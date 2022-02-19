import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min, Max } from 'class-validator';
import { CreatePropositionDto } from './create-proposition.dto';

export class UpdatePropositionDto extends PartialType(CreatePropositionDto) {
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(7)
  index: number;
}
