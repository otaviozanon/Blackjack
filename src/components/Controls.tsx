import React from 'react';
import { useGame } from '../hooks/useGame';

export const Controls: React.FC = () => {
  const { state, hit, stand, doubleDown, split } = useGame();
  const { status, playerHand, bank, currentBet } = state;

  if (status !== 'PLAYING') return null;

  const canHit = status === 'PLAYING';
  const canStand = status === 'PLAYING';
  const canDouble = status === 'PLAYING' && playerHand.length === 2 && bank >= currentBet;
  const canSplit = status === 'PLAYING' && playerHand.length === 2 && playerHand[0].value === playerHand[1].value && bank >= currentBet;

  const btnClass = "px-6 py-2.5 font-black rounded-full transition-all text-[10px] uppercase tracking-[0.2em] active:scale-95 shrink-0";
  const activeWhite = "bg-white text-black hover:bg-gold-light shadow-xl";
  const activeOutline = "bg-white/5 text-white border border-white/10 hover:bg-white/10";
  const disabledClass = "opacity-5 cursor-not-allowed border-none text-transparent bg-transparent pointer-events-none";

  return (
    <div className="flex items-center justify-center gap-3 p-2 w-full overflow-x-auto scrollbar-hide">
      <button 
        onClick={hit} 
        disabled={!canHit}
        className={`${btnClass} ${canHit ? activeWhite : disabledClass}`}
      >
        Hit
      </button>
      
      <button 
        onClick={stand} 
        disabled={!canStand}
        className={`${btnClass} ${canStand ? activeOutline : disabledClass}`}
      >
        Stand
      </button>

      <button 
        onClick={doubleDown} 
        disabled={!canDouble}
        className={`${btnClass} ${canDouble ? activeOutline : disabledClass}`}
      >
        Double
      </button>

      <button 
        onClick={split} 
        disabled={!canSplit}
        className={`${btnClass} ${canSplit ? activeOutline : disabledClass}`}
      >
        Split
      </button>
    </div>
  );
};
