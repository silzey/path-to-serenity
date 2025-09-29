export interface LogEntry {
  id: number;
  action: string;
  outcome: string;
}

export interface Character {
  affinity: number;
  bio: string;
}

export interface Review {
  id: number;
  user: string;
  rating: number; // 1-5
  comment: string;
}

export interface Product {
  id: number;
  name: string;
  type: 'video' | 'meditation' | 'ebook' | 'health' | 'podcast';
  price: number;
  description: string;
  assetUrl: string;
  imageUrl: string;
  unlockLevel?: number;
  reviews: Review[];
}

export interface UserProfile {
  name: string;
  avatar: string; // URL to the avatar image
  gallery: string[]; // Array of URLs for gallery images
}

export interface GameState {
  story: string;
  image: string;
  inventory: string[];
  relationships: { [key: string]: Character };
  log: LogEntry[];
  isGameOver: boolean;
  history: string[];
  currentModuleIndex: number;
  badges: string[];
  cart: Product[];
  library: Product[];
  profile: UserProfile;
  theme: 'light' | 'dark';
  products: Product[];
}