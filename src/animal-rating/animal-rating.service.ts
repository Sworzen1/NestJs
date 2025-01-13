import { Injectable } from '@nestjs/common';
import { AnimalsService } from 'src/animals/animals.service';

@Injectable()
export class AnimalRatingService {
  constructor(private readonly animalsService: AnimalsService) {}
}
