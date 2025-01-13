import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Color } from './color.entity';

@Entity('Animals')
export class Animal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ default: 0 })
  notes: number;

  @JoinTable()
  @ManyToMany(() => Color, (color) => color.animals, { cascade: true })
  colors: Color[];
}
