export interface UserDTO extends User {
  id: string;
}

export interface User {
  username: string;
  email: string;
  created_at: Date;
  token?: string;
}
