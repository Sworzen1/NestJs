import { Module } from '@nestjs/common';

import { AnimalRatingService } from './animal-rating.service';

import { AnimalsModule } from 'src/animals/animals.module';

@Module({
  imports: [AnimalsModule],
  providers: [AnimalRatingService],
})
export class AnimalRatingModule {}
