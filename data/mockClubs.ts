import { Club } from '@/types/club';

export const mockClubs: Club[] = [
  {
    id: 1,
    name: "Mystery Lovers Book Club",
    description: "Join us in unraveling the best mystery novels",
    members: 128,
    currentBook: {
      title: "The Silent Patient",
      author: "Alex Michaelides",
      coverUrl: "https://images.pexels.com/photos/3747279/pexels-photo-3747279.jpeg"
    },
    nextMeeting: "2025-02-15T18:00:00Z",
    unreadMessages: 3,
    category: "Mystery",
    coverUrl: "https://images.pexels.com/photos/5834/nature-grass-leaf-green.jpg"
  },
  {
    id: 2,
    name: "Science Fiction & Fantasy",
    description: "Exploring worlds beyond imagination",
    members: 256,
    currentBook: {
      title: "Project Hail Mary",
      author: "Andy Weir",
      coverUrl: "https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg"
    },
    nextMeeting: "2025-02-18T19:00:00Z",
    unreadMessages: 0,
    category: "Science Fiction",
    coverUrl: "https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg"
  }
];

export const recommendedClubs: Club[] = [
  {
    id: 3,
    name: "Historical Fiction Enthusiasts",
    description: "Exploring history through compelling narratives",
    members: 189,
    category: "Historical Fiction",
    coverUrl: "https://images.pexels.com/photos/159862/art-school-of-athens-raphael-italian-renaissance-fresco-159862.jpeg"
  },
  {
    id: 4,
    name: "Contemporary Literature",
    description: "Discussing modern literary masterpieces",
    members: 145,
    category: "Contemporary",
    coverUrl: "https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg"
  },
  {
    id: 5,
    name: "Poetry Circle",
    description: "Celebrating the beauty of verse",
    members: 92,
    category: "Poetry",
    coverUrl: "https://images.pexels.com/photos/636237/pexels-photo-636237.jpeg"
  }
];