import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnimalsController } from './animals.controller';
import { Animal } from './entities/animal.entity';
import { AnimalsService } from './animals.service';
import { Color } from './entities/color.entity';

import { Event } from 'src/events/entities/event.entity';
import animalsConfig from './config/animals.config';

class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

@Module({
  imports: [
    TypeOrmModule.forFeature([Animal, Color, Event]),
    ConfigModule.forFeature(animalsConfig),
  ],
  controllers: [AnimalsController],
  providers: [
    AnimalsService,
    {
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === 'development'
          ? DevelopmentConfigService
          : ProductionConfigService,
    },
    { provide: 'ANIMAL_CATEGORY', useFactory: () => ['wild', 'home'] },
  ],
  exports: [AnimalsService],
})
export class AnimalsModule {}
