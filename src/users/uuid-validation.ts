import { IsUUID } from 'class-validator';
import { InputType, Field } from 'type-graphql';
@InputType()
export class UUID {
  @IsUUID()
  @Field()
  id: string;
}
