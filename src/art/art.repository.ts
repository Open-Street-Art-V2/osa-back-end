import { UpdateArtDto } from './dto/update-art.dto';
import { CreateArtDto } from './dto/create-art.dto';
import { EntityRepository, Repository } from 'typeorm';
import { Art } from './art.entity';
import { User } from 'src/users/user.entity';

@EntityRepository(Art)
export class ArtRepository extends Repository<Art> {
  public async createArt(createArtDto: CreateArtDto, user: User): Promise<Art> {
    const art: Art = { ...createArtDto, user };
    console.log(art);
    return this.save(art);
  }

  public async editArt(updateArtDto: UpdateArtDto, editArt: Art): Promise<Art> {
    const art: Art = new Art();
    art.address = editArt.address;
    art.artist = editArt.artist;
    art.city = editArt.city;
    art.description = editArt.description;
    art.id = editArt.id;
    art.latitude = editArt.latitude;
    art.longitude = editArt.longitude;
    art.title = editArt.title;
    const toEdit: Art = { ...art, ...updateArtDto };
    console.log(toEdit);
    return this.save(toEdit);
  }
}
