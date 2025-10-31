export interface Card {
  id: number;
  imageIndex: number;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  level: number;
  cards: Card[];
  flippedCards: number[];
  matchedPairs: number;
  isPreview: boolean;
  isPlaying: boolean;
  timeLeft: number;
  gameOver: boolean;
  levelComplete: boolean;
  gameComplete: boolean;
}

export interface GameMetrics {
  moves: number;
  timeElapsed: number;
  seed: string;
}

export interface BestScore {
  time: number;
  moves: number;
  date: string;
}

export const LEVEL_TIME_LIMITS = {
  1: 70,
  2: 60,
  3: 50,
  4: 40,
  5: 30,
};

export const PREVIEW_TIME = 10;
export const FLIP_DELAY = 400;
export const PAIRS_PER_LEVEL = 6;
export const TOTAL_CARDS = PAIRS_PER_LEVEL * 2;
export const TOTAL_LEVELS = 5;
export const TOTAL_IMAGES_NEEDED = PAIRS_PER_LEVEL * TOTAL_LEVELS;
