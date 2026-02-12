
export type GameState = 'intro' | 'shuffling' | 'drawing' | 'revealing' | 'reading' | 'error';

export type Language = 'zh' | 'en';

export type DrawEffect = 'resonance' | 'stardust' | 'abyss' | 'thread';

export type BackgroundMode = 'white' | 'black' | 'starry';

export interface TarotCardData {
  id: number;
  name: string;
  nameEn: string;
  image: string;
  keywordsUpright: string[];
  keywordsReversed: string[];
  cardDescription: string;
  meaningUpright: string;
  meaningReversed: string;
}

export interface DeckCard extends TarotCardData {
  uniqueId: string;
  isReversed: boolean; 
}

export interface Point {
  x: number;
  y: number;
}
