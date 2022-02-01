import { IsOptional, IsString } from 'class-validator';

export class GetArtsQuery {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  artist?: string;
}
