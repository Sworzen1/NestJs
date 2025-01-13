import { IsOptional, IsString } from 'class-validator';

export class CreateAnimalDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly type: string;

  @IsOptional()
  @IsString({ each: true, always: false })
  readonly colors: string[];
}
