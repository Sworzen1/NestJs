import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimalsModule } from './animals/animals.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AnimalsModule,
    MongooseModule.forRoot('mongodb://localhost:27017/kurs_mongo'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
