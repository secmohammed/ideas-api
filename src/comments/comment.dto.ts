import { UserDTO } from '../users/user.dto';
import { IdeaDTO } from '../ideas/idea.dto';
export interface CommentDTO extends Comment {
  id: string;
}

export interface Comment {
  body: string;
  created_at: Date;
  author: UserDTO;
  idea: IdeaDTO;
}
