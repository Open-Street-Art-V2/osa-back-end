import { User } from 'src/users/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  // ManyToOne,
  OneToOne,
} from 'typeorm';

@Entity()
export class FavoriteArtist {
  @OneToOne((type) => User, { primary: true })
  @JoinColumn()
  user: User;

  // @ManyToOne(() => User, (user) => user.favoriteArtists, {
  //   primary: true,
  //   nullable: false,
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // artist: User;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at?: Date;
}
