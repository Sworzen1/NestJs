import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Animal } from './entities/animal.entity';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectModel(Animal.name) private readonly animalModel: Model<Animal>,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, page } = paginationQuery;

    const skip = page * limit;

    return await this.animalModel.find().skip(skip).limit(limit).exec();
  }

  async findOne(id: string) {
    const animal = await this.animalModel.findOne({ _id: id }).exec();

    if (!animal) {
      throw new HttpException(
        `Animal with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return animal;
  }

  create(createAnimalDto: CreateAnimalDto) {
    const newAnimal = new this.animalModel(createAnimalDto);

    return newAnimal.save();
  }

  async update(id: string, updateAnimalDto: UpdateAnimalDto) {
    const updatedAnimal = await this.animalModel
      .findByIdAndUpdate({ _id: id }, { $set: updateAnimalDto }, { new: true })
      .exec();

    if (!updatedAnimal) {
      throw new HttpException(
        `Animal with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return updatedAnimal;
  }

  async remove(id: string) {
    const existedAnimal = await this.findOne(id);

    return existedAnimal.deleteOne();
  }

  async addNote(animal: Animal) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      animal.notes++;

      const noteEvent = new this.eventModel({
        name: 'note',
        type: 'animal',
      });

      await noteEvent.save({ session });
      await animal.save({ session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
}
