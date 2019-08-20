import { ObjectType, Field } from 'type-graphql';
@ObjectType()
export class Auth {
  @Field()
  username: string;
  @Field()
  token: string;
}

