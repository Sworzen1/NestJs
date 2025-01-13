import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Animal } from './entities/animal.entity';
import { Color } from './entities/color.entity';

import { UpdateAnimalDto } from './dto/update-animal.dto';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';
import animalsConfig from './config/animals.config';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,

    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
    private readonly dataSource: DataSource,
    @Inject(animalsConfig.KEY)
    private readonly animalsConfiguration: ConfigType<typeof animalsConfig>,
  ) {
    console.log(animalsConfiguration.foo);
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, page } = paginationQuery;

    const skippedItems = (page - 1) * limit;

    return this.animalRepository.find({
      relations: ['colors'],
      skip: isNaN(skippedItems) ? 0 : (skippedItems ?? 0),
      take: limit,
    });
  }

  async findOne(id: string) {
    const animal = await this.animalRepository.findOne({
      where: { id: +id },
      relations: ['colors'],
    });

    if (!animal) {
      throw new HttpException(
        `Animal with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return animal;
  }

  async create(createAnimalDto: CreateAnimalDto) {
    const colors =
      createAnimalDto.colors &&
      (await Promise.all(
        createAnimalDto.colors.map((color) => this.preloadColorByName(color)),
      ));

    const animal = this.animalRepository.create({ ...createAnimalDto, colors });

    return this.animalRepository.save(animal);
  }

  async update(id: string, updateAnimalDto: UpdateAnimalDto) {
    const colors =
      updateAnimalDto.colors &&
      (await Promise.all(
        updateAnimalDto.colors.map((color) => this.preloadColorByName(color)),
      ));

    const animal = await this.animalRepository.preload({
      id: +id,
      ...updateAnimalDto,
      colors,
    });

    if (!animal) {
      throw new NotFoundException(`Animal with id ${id} not found`);
    }

    return this.animalRepository.save(animal);
  }

  async remove(id: string) {
    const animal = await this.findOne(id);

    return this.animalRepository.remove(animal);
  }

  private async preloadColorByName(name: string) {
    const existingColor = await this.colorRepository.findOne({
      where: { name },
    });

    if (existingColor) {
      return existingColor;
    }

    return this.colorRepository.create({ name });
  }

  async addNoteToAnimal(animal: Animal) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      animal.notes += 1;
      const noteEvent = new Event();

      noteEvent.name = 'note';
      noteEvent.type = 'type';
      noteEvent.payload = { animalId: animal.id };

      await queryRunner.manager.save(animal);
      await queryRunner.manager.save(noteEvent);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
