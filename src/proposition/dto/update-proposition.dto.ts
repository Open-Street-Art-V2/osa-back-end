import { PartialType } from '@nestjs/swagger';
import { CreatePropositionDto } from './create-proposition.dto';

export class UpdatePropositionDto extends PartialType(CreatePropositionDto) {}
