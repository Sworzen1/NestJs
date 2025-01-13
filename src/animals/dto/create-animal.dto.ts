import { IsNumber, IsString } from 'class-validator';

export class CreateAnimalDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly type: string;

  @IsString({ each: true })
  readonly colors: string[];
}
