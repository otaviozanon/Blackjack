import React from 'react';
import { clsx } from 'clsx';
import { Card as CardType } from '../types/game';
import { Card } from './Card';
import { calculateScore } from '../utils/cardUtils';

interface HandProps {
  title: string;
  cards: CardType[];
  isDealer?: boolean;
  isActive?: boolean;
}

export const Hand: React.FC<HandProps> = ({ title, cards, isDealer, isActive }) => {
  const visibleCards = cards.filter(c => !c.isHidden);
  const score = calculateScore(visibleCards);
  
  return (
    <div className={clsx(
      "flex flex-col items-center gap-3 md:gap-5 transition-all duration-500 rounded-3xl p-2",
      isActive ? "bg-white/5 ring-1 ring-white/10 casino-shadow scale-105" : "opacity-40 grayscale-[0.8]"
    )}>
      {/* Score Badge at Top for Everyone (Aesthetic Choice) */}
      <div className="flex items-center gap-2 z-10 h-6">
        {cards.length > 0 && (
          <div className="px-3 py-0.5 bg-black/80 backdrop-blur-md border border-white/5 rounded-full text-gold-light font-mono text-[10px] md:text-xs shadow-2xl">
            {isDealer && cards.some(c => c.isHidden) ? `${score} + ?` : score}
          </div>
        )}
      </div>

      <div className="flex -space-x-12 md:-space-x-14 h-24 md:h-40">
        {cards.map((card, idx) => (
          <div key={card.id} style={{ zIndex: idx }}>
            <Card card={card} index={idx} />
          </div>
        ))}
        {cards.length === 0 && (
          <div className="w-16 h-24 md:w-24 md:h-36 rounded-xl border-2 border-dashed border-white/5" />
        )}
      </div>
    </div>
  );
};
