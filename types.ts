export interface LogEntry {
  id: number;
  action: string;
  outcome: string;
}

export interface Character {
  affinity: number;
  bio: string;
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
}