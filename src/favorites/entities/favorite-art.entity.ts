/* disable-eslint */
import { Art } from 'src/art/art.entity';
import { User } from 'src/users/user.entity';
import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Index(['art', 'user'], { unique: true })
export class FavoriteArt {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne((type) => Art, { primary: true, eager: true })
  @JoinColumn()
  art: Art;

  @ManyToOne(() => User, (user) => user.favoriteArts, {
    primary: true,
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  user: User;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at?: Date;
}
