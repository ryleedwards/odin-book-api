export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Post {
  id: number;
  authorId: number;
  content: string;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  authorId: number;
  postId: number;
  content: string;
}
