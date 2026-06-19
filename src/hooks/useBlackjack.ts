import { useState, useCallback, useEffect } from 'react';
import { Card, GameState, ResultType, GameStatus } from '../types/game';
import { createDeck, calculateScore } from '../utils/cardUtils';
import { GAME_CONSTANTS } from '../constants/game';

export const useBlackjack = () => {
  const [state, setState] = useState<GameState>({
    deck: createDeck(),
    playerHand: [],
    splitHand: null,
    playerBet: 0,
    splitBet: 0,
    activeHand: 'player',
    dealerHand: [],
    status: 'BETTING',
    bank: GAME_CONSTANTS.INITIAL_BANK,
    currentBet: 0,
    result: 'NONE',
    message: 'Place your bet to start'
  });

  const placeBet = useCallback((amount: number) => {
    if (state.bank >= amount) {
      setState(prev => ({
        ...prev,
        currentBet: prev.currentBet + amount,
        playerBet: prev.playerBet + amount,
        bank: prev.bank - amount
      }));
    }
  }, [state.bank]);

  const deal = useCallback(() => {
    if (state.currentBet === 0) return;

    let currentDeck = [...state.deck];
    if (currentDeck.length < 10) {
      currentDeck = createDeck();
    }

    const p1 = currentDeck.pop();
    const d1 = currentDeck.pop();
    const p2 = currentDeck.pop();
    const d2_raw = currentDeck.pop();

    if (!p1 || !d1 || !p2 || !d2_raw) return;
    const d2 = { ...d2_raw, isHidden: true };

    const playerHand = [p1, p2];
    const dealerHand = [d1, d2];
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore([d1, d2_raw]);

    let status: GameStatus = 'PLAYING';
    let result: ResultType = 'NONE';
    let message = 'Your turn';
    let bank = state.bank;

    if (playerScore === 21 && dealerScore === 21) {
      status = 'RESULTS';
      result = 'PUSH';
      message = 'Both have Blackjack! Push.';
      bank += state.currentBet;
    } else if (playerScore === 21) {
      status = 'RESULTS';
      result = 'PLAYER_BLACKJACK';
      message = 'BLACKJACK!';
      bank += Math.floor(state.currentBet * (1 + GAME_CONSTANTS.BLACKJACK_PAYOUT)); 
    } else if (dealerScore === 21) {
      status = 'RESULTS';
      result = 'DEALER_BLACKJACK';
      message = 'Dealer has Blackjack!';
    }

    setState(prev => ({
      ...prev,
      deck: currentDeck,
      playerHand,
      dealerHand: status === 'RESULTS' ? dealerHand.map(c => ({ ...c, isHidden: false })) : dealerHand,
      status,
      result,
      message,
      bank,
      activeHand: 'player'
    }));
  }, [state.deck, state.currentBet, state.bank]);

  const hit = useCallback(() => {
    let currentDeck = [...state.deck];
    if (currentDeck.length < 1) {
      currentDeck = createDeck();
    }
    const card = currentDeck.pop();
    if (!card) return;

    const isSplit = state.activeHand === 'split';
    const newHand = isSplit ? [...(state.splitHand || []), card] : [...state.playerHand, card];
    const score = calculateScore(newHand);

    if (score > 21) {
      if (!isSplit && state.splitHand) {
        // Bust on first hand, move to split hand
        setState(prev => ({
          ...prev,
          deck: currentDeck,
          playerHand: newHand,
          activeHand: 'split',
          message: 'First hand bust! Playing second hand...'
        }));
      } else {
        // Current hand bust. If it's the second hand or no split exists.
        const firstHandBust = calculateScore(state.playerHand) > 21;
        

        if (!isSplit) {
          // No split, just normal bust
          setState(prev => ({
            ...prev,
            deck: currentDeck,
            playerHand: newHand,
            status: 'RESULTS',
            result: 'PLAYER_BUST',
            message: 'Bust! You went over 21'
          }));
        } else {
          // Split scenario, second hand just busted
          setState(prev => ({
            ...prev,
            deck: currentDeck,
            splitHand: newHand,
            status: 'DEALER_TURN',
            message: firstHandBust ? 'Both hands bust!' : 'Second hand bust! Dealer turn...'
          }));
        }
      }
    } else {
      setState(prev => ({
        ...prev,
        deck: currentDeck,
        [isSplit ? 'splitHand' : 'playerHand']: newHand
      }));
    }
  }, [state.deck, state.playerHand, state.splitHand, state.activeHand]);

  const stand = useCallback(() => {
    if (state.activeHand === 'player' && state.splitHand) {
      setState(prev => ({
        ...prev,
        activeHand: 'split',
        message: 'Playing second hand...'
      }));
    } else {
      setState(prev => ({ 
        ...prev, 
        status: 'DEALER_TURN',
        message: 'Dealer turn...'
      }));
    }
  }, [state.activeHand, state.splitHand]);

  // Dealer Logic
  useEffect(() => {
    if (state.status !== 'DEALER_TURN') return;

    // 1. Reveal hidden cards first with delay
    const hasHidden = state.dealerHand.some(c => c.isHidden);
    if (hasHidden) {
      const timer = setTimeout(() => {
        setState(prev => ({
          ...prev,
          dealerHand: prev.dealerHand.map(c => ({ ...c, isHidden: false }))
        }));
      }, GAME_CONSTANTS.DELAYS.DEALER_REVEAL);
      return () => clearTimeout(timer);
    }

    // 2. Dealer hit/finish logic
    const dealerScore = calculateScore(state.dealerHand);
    const playerBust = calculateScore(state.playerHand) > 21;
    const splitBust = state.splitHand ? calculateScore(state.splitHand) > 21 : true;

    // Skip dealer hits if all active player hands bust
    const allBust = state.splitHand ? (playerBust && splitBust) : playerBust;

    if (allBust) {
      const timer = setTimeout(() => {
        setState(prev => ({
          ...prev,
          status: 'RESULTS',
          result: 'PLAYER_BUST',
          message: state.splitHand ? 'Both hands bust!' : 'Bust!'
        }));
      }, GAME_CONSTANTS.DELAYS.RESULTS_SHOW);
      return () => clearTimeout(timer);
    }

    if (dealerScore < GAME_CONSTANTS.DEALER_STAND_THRESHOLD) {
      const timer = setTimeout(() => {
        let currentDeck = [...state.deck];
        if (currentDeck.length < 1) {
          currentDeck = createDeck();
        }
        const card = currentDeck.pop();
        if (!card) return;
        setState(prev => ({
          ...prev,
          deck: currentDeck,
          dealerHand: [...prev.dealerHand, card]
        }));
      }, GAME_CONSTANTS.DELAYS.DEALER_HIT);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        const playerScore = calculateScore(state.playerHand);
        const splitScore = state.splitHand ? calculateScore(state.splitHand) : null;
        
        let bankChange = 0;

        const evaluateHand = (score: number, bet: number) => {
          if (score > 21) return 0;
          if (dealerScore > 21 || dealerScore < score) return bet * 2;
          if (dealerScore > score) return 0;
          return bet;
        };

        bankChange += evaluateHand(playerScore, state.playerBet);
        if (splitScore !== null) {
          bankChange += evaluateHand(splitScore, state.splitBet);
        }

        let finalResult: ResultType = 'PLAYER_WIN';
        if (bankChange === 0) finalResult = 'DEALER_WIN';
        else if (bankChange === state.currentBet) finalResult = 'PUSH';

        setState(prev => ({
          ...prev,
          status: 'RESULTS',
          result: finalResult,
          message: state.splitHand ? 'Player vs Split result' : finalResult.replace('_', ' '),
          bank: prev.bank + bankChange
        }));
      }, GAME_CONSTANTS.DELAYS.RESULTS_SHOW);
      return () => clearTimeout(timer);
    }
  }, [state.status, state.dealerHand, state.playerHand, state.splitHand, state.deck, state.currentBet, state.playerBet, state.splitBet]);

  const doubleDown = useCallback(() => {
    const isSplit = state.activeHand === 'split';
    const currentHand = isSplit ? state.splitHand : state.playerHand;
    const currentHandBet = isSplit ? state.splitBet : state.playerBet;

    if (!currentHand || state.bank < currentHandBet || currentHand.length !== 2) return;

    let currentDeck = [...state.deck];
    if (currentDeck.length < 1) {
      currentDeck = createDeck();
    }
    const card = currentDeck.pop();
    if (!card) return;

    const newHand = [...currentHand, card];
    const score = calculateScore(newHand);

    if (!isSplit && state.splitHand) {
       setState(prev => ({
        ...prev,
        bank: prev.bank - currentHandBet,
        currentBet: prev.currentBet + currentHandBet,
        playerBet: prev.playerBet + currentHandBet,
        deck: currentDeck,
        playerHand: newHand,
        activeHand: 'split',
        message: score > 21 ? 'First hand bust! Playing second hand...' : 'Playing second hand...'
      }));
    } else {
      setState(prev => ({
        ...prev,
        bank: prev.bank - currentHandBet,
        currentBet: prev.currentBet + currentHandBet,
        [isSplit ? 'splitBet' : 'playerBet']: prev[isSplit ? 'splitBet' : 'playerBet'] + currentHandBet,
        deck: currentDeck,
        [isSplit ? 'splitHand' : 'playerHand']: newHand,
        status: 'DEALER_TURN',
        message: score > 21 ? 'Hand bust! Dealer turn...' : 'Dealer turn...'
      }));
    }
  }, [state.deck, state.playerHand, state.splitHand, state.activeHand, state.currentBet, state.bank, state.playerBet, state.splitBet]);

  const split = useCallback(() => {
    if (state.playerHand.length !== 2 || state.playerHand[0].value !== state.playerHand[1].value || state.bank < state.playerBet) return;

    let currentDeck = [...state.deck];
    if (currentDeck.length < 2) {
      currentDeck = createDeck();
    }
    const card1 = currentDeck.pop();
    const card2 = currentDeck.pop();
    if (!card1 || !card2) return;

    setState(prev => ({
      ...prev,
      bank: prev.bank - prev.playerBet,
      currentBet: prev.currentBet + prev.playerBet,
      playerBet: prev.playerBet,
      splitBet: prev.playerBet,
      deck: currentDeck,
      playerHand: [prev.playerHand[0], card1],
      splitHand: [prev.playerHand[1], card2],
      activeHand: 'player',
      message: 'Hands split! Playing first hand...'
    }));
  }, [state.deck, state.playerHand, state.bank, state.playerBet, state.currentBet]);


  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      deck: prev.deck.length < GAME_CONSTANTS.MIN_CARDS_BEFORE_SHUFFLE ? createDeck() : prev.deck,
      playerHand: [],
      splitHand: null,
      playerBet: 0,
      splitBet: 0,
      dealerHand: [],
      status: 'BETTING',
      currentBet: 0,
      result: 'NONE',
      message: 'Place your bet to start'
    }));
  }, []);

  const clearBet = useCallback(() => {
    setState(prev => ({
      ...prev,
      bank: prev.bank + prev.currentBet,
      currentBet: 0,
      playerBet: 0,
      splitBet: 0
    }));
  }, []);

  const rebuy = useCallback(() => {
    setState(prev => ({
      ...prev,
      bank: GAME_CONSTANTS.INITIAL_BANK,
      currentBet: 0,
      playerBet: 0,
      splitBet: 0,
      status: 'BETTING',
      result: 'NONE',
      message: 'Bankroll replenished. Good luck.'
    }));
  }, []);

  return { state, placeBet, deal, hit, stand, doubleDown, split, reset, clearBet, rebuy };
};
