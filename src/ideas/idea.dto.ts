import { UserDTO } from '../users/user.dto';
export interface IdeaDTO extends Idea {
  id: string;
}

export interface Idea {
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  author: UserDTO;
  upvotes?: number;
  downvotes?: number;
}
