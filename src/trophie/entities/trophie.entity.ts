import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity()
export class Trophie {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  nbProposal: number;

  @Column()
  CreationDate: Date;

  @ManyToMany((type) => User, (user) => user.trophies)
  users: User[];
}
