import { Test, TestingModule } from '@nestjs/testing';
import { AnimalRatingService } from './animal-rating.service';

describe('AnimalRatingService', () => {
  let service: AnimalRatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnimalRatingService],
    }).compile();

    service = module.get<AnimalRatingService>(AnimalRatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
