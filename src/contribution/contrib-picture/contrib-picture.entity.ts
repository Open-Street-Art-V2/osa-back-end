import { contrubArt } from 'src/contribution/contrub.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class ContribPicture {
  @PrimaryColumn()
  public position: number;

  @Column()
  url: string;

  @ManyToOne(() => contrubArt, (contribution) => contribution.pictures, {
    primary: true,
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  contribution: contrubArt;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at?: Date;
}
