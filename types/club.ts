export interface Club {
  id: number;
  name: string;
  description: string;
  members: number;
  currentBook?: {
    title: string;
    author: string;
    coverUrl: string;
  };
  nextMeeting?: string;
  unreadMessages?: number;
  category: string;
  coverUrl: string;
}