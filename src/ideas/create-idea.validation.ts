import { MinLength, MaxLength, IsNotEmpty } from 'class-validator';
import { InputType, Field } from 'type-graphql';
@InputType()
export class CreateIdea {
  @MinLength(3)
  @MaxLength(32)
  @IsNotEmpty()
  @Field()
  title: string;
  @MinLength(10)
  @MaxLength(255)
  @IsNotEmpty()
  @Field()
  description: string;
}
