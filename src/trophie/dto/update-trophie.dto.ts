import { PartialType } from '@nestjs/swagger';
import { CreateTrophieDto } from './create-trophie.dto';

export class UpdateTrophieDto extends PartialType(CreateTrophieDto) {}
