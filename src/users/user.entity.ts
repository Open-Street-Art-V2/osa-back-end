import { Art } from 'src/art/art.entity';
import { Role } from 'src/auth/roles/role.enum';
import { Proposition } from 'src/proposition/entities/proposition.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
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

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @Column({ default: false })
  blocked: boolean;
}
