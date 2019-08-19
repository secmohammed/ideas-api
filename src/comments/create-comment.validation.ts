import { IsString, MinLength, MaxLength } from 'class-validator';
import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateComment {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @Field()
  body: string;
}
