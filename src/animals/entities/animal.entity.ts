import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Animal extends Document {
  @Prop()
  name: string;

  @Prop()
  type: string;

  @Prop({ default: 0 })
  notes: number;

  @Prop([String])
  colors: string[];
}

export const AnimalSchema = SchemaFactory.createForClass(Animal);
