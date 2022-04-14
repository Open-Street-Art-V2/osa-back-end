import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  // ManyToMany,
  // JoinTable,
} from 'typeorm';
// import { User } from 'src/users/user.entity';

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

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  CreationDate: Date;

  // @ManyToMany((type) => User)
  // @JoinTable()
  // users: User[];
}
