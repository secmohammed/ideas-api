import { Min, Max, IsNotEmpty } from 'class-validator';
export class CreateIdea {
  @Min(3)
  @Max(32)
  @IsNotEmpty()
  title: string;
  @Min(10)
  @Max(255)
  @IsNotEmpty()
  description: string;
}
