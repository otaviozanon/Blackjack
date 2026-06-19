import React, { createContext, useContext, ReactNode } from 'react';
import { useBlackjack } from './useBlackjack';

type GameContextType = ReturnType<typeof useBlackjack>;

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const game = useBlackjack();
  return (
    <GameContext.Provider value={game}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
