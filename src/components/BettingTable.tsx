import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useGame } from '../hooks/useGame';

const CHIPS = [
  { value: 10, color: 'bg-white text-black ring-gold' },
  { value: 50, color: 'bg-red-800 text-white ring-gold' },
  { value: 100, color: 'bg-blue-900 text-white ring-gold' },
  { value: 500, color: 'bg-charcoal text-gold ring-gold' },
];

export const BettingTable: React.FC = () => {
  const { state, placeBet, deal } = useGame();
  const { bank, currentBet, status } = state;
  const disabled = status !== 'BETTING';

  if (status !== 'BETTING') return null;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="flex gap-4 md:gap-8 py-2">
        {CHIPS.map(chip => (
          <button
            key={chip.value}
            onClick={() => placeBet(chip.value)}
            disabled={disabled || bank < chip.value}
            className={clsx(
              "relative w-14 h-14 md:w-16 md:h-16 rounded-full transition-all hover:-translate-y-2 active:translate-y-0 disabled:opacity-10 disabled:grayscale chip-shadow group",
              chip.color
            )}
          >
            {/* Minimalist 3D Chip */}
            <div className="absolute inset-0 rounded-full border-b-[2px] border-black/60" />
            <div className="absolute inset-1 border border-white/5 rounded-full flex items-center justify-center font-black text-xs md:text-sm">
              {chip.value}
            </div>
            <div className="absolute top-1 left-2 w-3 h-1.5 bg-white/10 rounded-full blur-[1px] rotate-[-45deg]" />
          </button>
        ))}
      </div>

      {currentBet > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={deal}
          className="bg-white text-black px-12 py-3 font-black rounded-full hover:bg-gold-light transition-all shadow-2xl text-xs uppercase tracking-[0.3em]"
        >
          Deal
        </motion.button>
      )}
    </div>
  );
};
