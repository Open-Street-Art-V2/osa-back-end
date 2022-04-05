import { User } from 'src/users/user.entity';
import {
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Index(['user', 'artist'], { unique: true })
export class FavoriteArtist {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User, (user) => user.users, {
    primary: true,
    nullable: false,
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => User, (user) => user.favoriteArtists, {
    primary: true,
    nullable: false,
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  artist: User;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at?: Date;
}
