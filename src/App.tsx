import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "./hooks/useGame";
import { Hand } from "./components/Hand";
import { BettingTable } from "./components/BettingTable";
import { Controls } from "./components/Controls";

function App() {
  const { state, reset, clearBet, rebuy } = useGame();

  const isBust =
    state.bank === 0 && state.currentBet === 0 && state.status !== "RESULTS";

  return (
    <div className="h-screen w-screen felt-table flex flex-col items-center px-4 font-sans selection:bg-gold/30 overflow-hidden text-white/90">
      {/* Sleek Top Bar */}
      <header className="w-full max-w-5xl flex items-center justify-between py-4 md:py-6 shrink-0 z-30">
        <div className="flex flex-col">
          <span className="text-[10px] text-white/20 uppercase font-black tracking-[0.3em]">
            Bankroll
          </span>
          <span className="text-xl md:text-2xl font-mono font-bold text-gold-light tracking-tighter">
            ${state.bank.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col items-center opacity-30">
          <h1 className="text-xs md:text-sm font-display font-bold tracking-[0.5em] uppercase">
              BLACKJACK PRO
          </h1>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] text-white/20 uppercase font-black tracking-[0.3em]">
            Active Bet
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-mono font-bold text-white tracking-tighter">
              ${state.currentBet}
            </span>
            {state.currentBet > 0 && state.status === "BETTING" && (
              <button
                onClick={clearBet}
                className="text-red-500/40 hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Table Area */}
      <main className="flex-[2] flex flex-col items-center justify-center gap-8 md:gap-12 w-full max-w-6xl overflow-hidden min-h-0 py-2">
        {/* Dealer Area */}
        <div className="shrink-0">
          <Hand
            title="Dealer"
            cards={state.dealerHand}
            isDealer
            isActive={state.status === "DEALER_TURN"}
          />
        </div>

        {/* Player Hands Area */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-32 w-full shrink min-h-0">
          <Hand
            title="Player"
            cards={state.playerHand}
            isActive={
              (state.status === "PLAYING" && state.activeHand === "player") ||
              state.status === "DEALER_TURN" ||
              state.status === "RESULTS"
            }
          />

          <AnimatePresence>
            {state.splitHand && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Hand
                  title="Split"
                  cards={state.splitHand}
                  isActive={
                    (state.status === "PLAYING" && state.activeHand === "split") ||
                    state.status === "DEALER_TURN" ||
                    state.status === "RESULTS"
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="flex-1 w-full flex flex-col items-center justify-start relative z-20 shrink-0 pb-12 md:pb-20">
        <div className="w-full max-w-xl flex flex-col items-center gap-4">
          <BettingTable />
          <Controls />
        </div>

        {/* Results Overlay */}
        <AnimatePresence>
          {state.status === "RESULTS" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-[100] gap-4 md:gap-8 backdrop-blur-xl pointer-events-auto"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-white/20 uppercase font-black tracking-[0.4em]">
                  Final Result
                </span>
                <h2 className="text-4xl md:text-7xl font-display font-bold gold-shimmer uppercase text-center px-4 italic">
                  {state.result.replace("_", " ")}
                </h2>
              </div>

              <button
                onClick={
                  state.bank === 0 && state.currentBet === 0 ? rebuy : reset
                }
                className="bg-white text-black px-12 py-4 text-sm md:text-base font-black rounded-full hover:bg-gold-light active:scale-95 transition-all shadow-2xl uppercase tracking-[0.3em] cursor-pointer z-[110]"
              >
                {state.bank === 0 && state.currentBet === 0
                  ? "Rebuy Chips"
                  : "Play Again"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Standalone Bust/Rebuy Overlay */}
        <AnimatePresence>
          {isBust && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black flex flex-col items-center justify-center z-[120] gap-6"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-white/20 uppercase font-black tracking-[0.4em]">
                  Out of Chips
                </span>
                <h2 className="text-4xl font-display font-bold text-white uppercase italic tracking-tighter">
                  Bust
                </h2>
              </div>
              <button
                onClick={rebuy}
                className="bg-white text-black px-10 py-3 text-xs font-black rounded-full hover:bg-gold-light transition-all uppercase tracking-[0.3em] cursor-pointer"
              >
                Rebuy $1,000
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>
    </div>
  );
}

export default App;
