import { IsNumber, IsString } from 'class-validator';

export class CreateAnimalDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  readonly name: string;

  @IsString()
  readonly type: string;
}
