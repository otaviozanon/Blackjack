import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Diamond, Club, Spade } from 'lucide-react';
import { Card as CardType, Suit } from '../types/game';
import { clsx } from 'clsx';

const SuitIcon = ({ suit, className }: { suit: Suit; className?: string }) => {
  switch (suit) {
    case 'hearts': return <Heart className={clsx("fill-red-500 text-red-500", className)} />;
    case 'diamonds': return <Diamond className={clsx("fill-red-500 text-red-500", className)} />;
    case 'clubs': return <Club className={clsx("fill-black text-black", className)} />;
    case 'spades': return <Spade className={clsx("fill-black text-black", className)} />;
  }
};

export const Card: React.FC<{ card: CardType; index: number }> = ({ card, index }) => {
  // Add slight random tilt for physical feel
  const rotation = (index % 2 === 0 ? 1 : -1) * (index * 2);

  if (card.isHidden) {
    return (
      <motion.div
        initial={{ rotateY: 180, x: -100, opacity: 0 }}
        animate={{ rotateY: 180, x: 0, opacity: 1, rotateZ: rotation }}
        transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
        className="relative w-16 h-24 md:w-24 md:h-36 bg-[#0a0a0a] rounded-xl border border-white/5 casino-shadow flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '6px 6px' }} />
        <div className="w-10 h-16 md:w-16 md:h-24 border border-white/5 rounded-lg bg-white/5 backdrop-blur-sm shadow-inner" />
      </motion.div>
    );
  }

  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, rotateY: 90, rotateZ: rotation }}
      animate={{ scale: 1, opacity: 1, rotateY: 0, rotateZ: rotation }}
      exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: index * 0.1 }}
      className={clsx(
        "relative w-16 h-24 md:w-24 md:h-36 bg-white rounded-xl casino-shadow flex flex-col p-1 md:p-2 border border-black/5",
        isRed ? "text-red-600" : "text-black"
      )}
    >
      <div className="flex flex-col items-start leading-none">
        <span className="text-sm md:text-xl font-black font-mono tracking-tighter">{card.rank}</span>
        <SuitIcon suit={card.suit} className="w-2.5 h-2.5 md:w-4 md:h-4" />
      </div>
      
      <div className="flex-1 flex items-center justify-center opacity-[0.03] absolute inset-0 pointer-events-none">
        <SuitIcon suit={card.suit} className="w-16 h-16 md:w-20 md:h-20" />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <SuitIcon suit={card.suit} className="w-8 h-8 md:w-10 md:h-10 opacity-90" />
      </div>

      <div className="flex flex-col items-end leading-none rotate-180">
        <span className="text-sm md:text-xl font-black font-mono tracking-tighter">{card.rank}</span>
        <SuitIcon suit={card.suit} className="w-2.5 h-2.5 md:w-4 md:h-4" />
      </div>
    </motion.div>
  );
};
