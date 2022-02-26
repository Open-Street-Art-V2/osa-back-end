import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { CreateArtDto } from 'src/art/dto/create-art.dto';

export class ContributionDto extends CreateArtDto {
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(7)
  index: number;
}
