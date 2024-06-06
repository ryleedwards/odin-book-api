export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Post {
  id: number;
  authorId: number;
  content: string;
}
