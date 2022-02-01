import { UpdateArtDto } from './dto/update-art.dto';
import { CreateArtDto } from './dto/create-art.dto';
import { EntityRepository, Repository } from 'typeorm';
import { Art } from './art.entity';

@EntityRepository(Art)
export class ArtRepository extends Repository<Art> {
  public async createArt(createArtDto: CreateArtDto): Promise<Art> {
    const art: Art = { ...createArtDto };
    return this.save(art);
  }

  public async editArt(updateArtDto: UpdateArtDto, editArt: Art): Promise<Art> {
    const toEdit: Art = { ...editArt, ...updateArtDto };
    return this.save(toEdit);
  }
}
