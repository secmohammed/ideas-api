import { MinLength, MaxLength, IsNotEmpty } from 'class-validator';
export class CreateIdea {
  @MinLength(3)
  @MaxLength(32)
  @IsNotEmpty()
  title: string;
  @MinLength(10)
  @MaxLength(255)
  @IsNotEmpty()
  description: string;
}
