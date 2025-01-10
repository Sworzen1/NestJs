import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Animal } from './entities/animal.entity';
import { UpdateAnimalDto } from './dto/update-animal.dto';

@Injectable()
export class AnimalsService {
  private animals: Animal[] = [
    { id: 1, name: 'Golden Retiver', type: 'dog' },
    { id: 2, name: 'Eagle', type: 'bird' },
    { id: 3, name: 'Wrobel', type: 'bird' },
  ];

  findAll(): Animal[] {
    return this.animals;
  }

  findOne(id: string): Animal {
    const animal = this.animals.find((animal) => animal.id === +id);

    if (!animal) {
      throw new HttpException(
        `Animal with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return animal;
  }

  create(createAnimalDto: any) {
    this.animals.push(createAnimalDto);

    return createAnimalDto;
  }

  update(id: number, createAnimalDto) {
    const index = this.animals.findIndex((animal) => animal.id === +id);
    this.animals[index] = { id, ...createAnimalDto };

    return createAnimalDto;
  }

  remove(id: string) {
    this.animals = this.animals.filter((animal) => animal.id !== +id);
  }
}
