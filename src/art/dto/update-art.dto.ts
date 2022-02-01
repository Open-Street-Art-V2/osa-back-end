import { PartialType } from '@nestjs/mapped-types';
import { CreateArtDto } from './create-art.dto';

export class UpdateArtDto extends PartialType(CreateArtDto) {}
