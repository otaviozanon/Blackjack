export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  value: number;
  isHidden?: boolean;
}

export type GameStatus = 'BETTING' | 'DEALING' | 'PLAYING' | 'DEALER_TURN' | 'RESULTS';

export type ResultType = 'PLAYER_BLACKJACK' | 'DEALER_BLACKJACK' | 'PLAYER_BUST' | 'DEALER_BUST' | 'PLAYER_WIN' | 'DEALER_WIN' | 'PUSH' | 'NONE';

export interface GameState {
  deck: Card[];
  playerHand: Card[];
  splitHand: Card[] | null;
  playerBet: number;
  splitBet: number;
  activeHand: 'player' | 'split';
  dealerHand: Card[];
  status: GameStatus;
  bank: number;
  currentBet: number;
  result: ResultType;
  message: string;
}
