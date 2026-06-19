import { Card, Rank, Suit } from '../types/game';

export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  SUITS.forEach(suit => {
    RANKS.forEach(rank => {
      let value = parseInt(rank);
      if (rank === 'A') value = 11;
      else if (['J', 'Q', 'K'].includes(rank)) value = 10;
      
      deck.push({
        id: crypto.randomUUID ? crypto.randomUUID() : `${rank}-${suit}-${Math.random().toString(36).slice(2)}`,
        suit,
        rank,
        value
      });
    });
  });
  return shuffle(deck);
};

export const shuffle = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  const array = new Uint32Array(newDeck.length);
  crypto.getRandomValues(array);
  
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = array[i] % (i + 1);
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const calculateScore = (hand: Card[]): number => {
  let score = hand.reduce((acc, card) => acc + card.value, 0);
  let aces = hand.filter(card => card.rank === 'A').length;

  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }

  return score;
};
