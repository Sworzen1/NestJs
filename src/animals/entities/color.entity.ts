import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Animal } from './animal.entity';

@Entity()
export class Color {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Animal, (animal) => animal.colors)
  animals: Animal[];
}
