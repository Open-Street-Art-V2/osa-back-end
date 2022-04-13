import { Art } from 'src/art/art.entity';
import { Role } from 'src/auth/roles/role.enum';
import { FavoriteArt } from 'src/favorites/entities/favorite-art.entity';
import { FavoriteArtist } from 'src/favorites/entities/favorite-artist.entity';
// import { FavoriteArtist } from 'src/favorites/entities/favorite-artist.entity';
import { Proposition } from 'src/proposition/entities/proposition.entity';
import { Trophie } from 'src/trophie/entities/trophie.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  name: string;

  @Column()
  firstname: string;

  @Column({ nullable: true })
  favoriteCity: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column('enum', { enum: Role })
  role: Role;

  @OneToMany(() => Art, (art) => art.user, {
    nullable: true,
    eager: true,
  })
  arts: Art[];

  @OneToMany(() => Proposition, (proposition) => proposition.user)
  propositions?: Proposition[];

  @OneToMany(() => FavoriteArt, (favoriteArt) => favoriteArt.user)
  favoriteArts?: FavoriteArt[];

  @OneToMany(() => FavoriteArtist, (favoriteArtist) => favoriteArtist.artist, {
    eager: false,
  })
  favoriteArtists: FavoriteArtist[];

  @OneToMany(() => FavoriteArtist, (favoriteArtist) => favoriteArtist.user, {
    eager: false,
  })
  users: FavoriteArtist[];

  @ManyToMany((type) => Trophie, (trophie) => trophie.users)
  trophies: Trophie[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @Column({ default: false })
  blocked: boolean;
}
