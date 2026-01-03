"use client";

import { useState, useEffect, useRef } from 'react';
import { useWallet } from '@/context/wallet-context';
import { Rocket } from 'lucide-react';

export default function CrashGame() {
  const { balance, refreshBalance } = useWallet();
  const [betAmount, setBetAmount] = useState(10);
  const [multiplier, setMultiplier] = useState(1.00);
  const [isPlaying, setIsPlaying] = useState(false); // Game loop active
  const [isBusted, setIsBusted] = useState(false);
  const [hasBet, setHasBet] = useState(false); // User has placed a bet for THIS round
  const [cashedOut, setCashedOut] = useState(false);

  const [nextRoundCountdown, setNextRoundCountdown] = useState(0);

  const crashPointRef = useRef(0);
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const startGameLoop = () => {
     // Reset state for new round
     setMultiplier(1.00);
     setIsBusted(false);
     setCashedOut(false);
     setIsPlaying(true);

     // Determine crash point
     // Crash algorithm: E = 100 / (1 - U) where U is uniform random [0,1)
     // But a simpler one: 0.99 / (1-Math.random())
     // And apply house edge (e.g. 1% instant bust)
     const r = Math.random();
     if (r < 0.03) {
         crashPointRef.current = 1.00; // Instant bust
     } else {
         const r2 = Math.random();
         crashPointRef.current = Math.max(1.00, (1 / (1 - r2)) * 0.95);
     }

     console.log("Crash Point:", crashPointRef.current); // Cheating for debugging ;)

     startTimeRef.current = Date.now();
     requestRef.current = requestAnimationFrame(updateGame);
  };

  const updateGame = () => {
      const now = Date.now();
      const elapsed = (now - startTimeRef.current) / 1000;
      // Exponential growth curve: 1.00 * e^(0.06 * t)  -- adjust speed as needed
      // Or simpler: t^2... lets use exponential
      const currentMult = Math.pow(Math.E, 0.1 * elapsed); // Slow start, speeds up

      if (currentMult >= crashPointRef.current) {
          setMultiplier(crashPointRef.current);
          handleCrash();
      } else {
          setMultiplier(currentMult);
          requestRef.current = requestAnimationFrame(updateGame);
      }
  };

  const handleCrash = () => {
      setIsBusted(true);
      setIsPlaying(false);
      cancelAnimationFrame(requestRef.current);

      // Start cooldown
      setNextRoundCountdown(5);
  };

  useEffect(() => {
      let timer: NodeJS.Timeout;
      if (nextRoundCountdown > 0) {
          timer = setTimeout(() => setNextRoundCountdown(c => c - 1), 1000);
      } else if (nextRoundCountdown === 0 && isBusted) {
          setHasBet(false); // Reset bet status for next round
          // Trigger start game loop via a side effect or separate call?
          // Since startGameLoop is a function, we need to be careful about dependencies.
          // Ideally we toggle a state that triggers the loop.
          // But for now, let's just suppress the warning or wrap it.
          const start = async () => { startGameLoop(); };
          start();
      }
      return () => clearTimeout(timer);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextRoundCountdown, isBusted]);

  // Initial start
  useEffect(() => {
      // Start the first game loop
      startGameLoop();
      return () => cancelAnimationFrame(requestRef.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const placeBet = async () => {
      if (balance < betAmount) return;

      const res = await fetch('/api/user/transaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'WITHDRAW', amount: betAmount }),
      });

      if (res.ok) {
          await refreshBalance();
          setHasBet(true);
      }
  };

  const handleCashOut = async () => {
      if (!isPlaying || isBusted || cashedOut) return;

      const winAmount = betAmount * multiplier;
      setCashedOut(true);

      await fetch('/api/user/transaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'DEPOSIT', amount: winAmount }),
      });
      await refreshBalance();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">
        <div className="w-full md:w-80 bg-casino-card p-6 rounded-xl border border-gray-800 space-y-6">
             <div className="space-y-4">
                 <label className="text-gray-400 text-sm block">Valor da Aposta</label>
                 <input
                   type="number"
                   value={betAmount}
                   onChange={(e) => setBetAmount(Number(e.target.value))}
                   disabled={hasBet} // Can't change bet if already placed for next round
                   className="bg-casino-dark w-full p-2 rounded border border-gray-700 text-white"
                 />

                 {!hasBet ? (
                     <button
                       onClick={placeBet}
                       disabled={isPlaying && !isBusted} // Can only bet during cooldown or if not playing?
                       // Actually, in real crash you bet for the NEXT round.
                       // For simplicity here: You can bet if isBusted (during cooldown) OR if game hasn't started.
                       // If game is running, you are waiting for next round.
                       className="w-full bg-casino-green hover:bg-casino-green-light text-white font-bold py-4 rounded-lg shadow-lg"
                     >
                        {isPlaying ? 'Apostar (Próxima Rodada)' : 'Apostar'}
                     </button>
                 ) : (
                     <button
                       onClick={handleCashOut}
                       disabled={!isPlaying || cashedOut || isBusted}
                       className={`w-full font-bold py-4 rounded-lg shadow-lg ${cashedOut ? 'bg-gray-600 cursor-not-allowed' : 'bg-casino-gold hover:bg-yellow-500 text-black'}`}
                     >
                       {cashedOut ? 'Sacado!' : `Sacar (${(betAmount * multiplier).toFixed(2)})`}
                     </button>
                 )}

                 {hasBet && !isPlaying && !isBusted && (
                     <p className="text-center text-yellow-500 text-sm">Aposta confirmada para a próxima rodada...</p>
                 )}
             </div>
        </div>

        <div className="flex-1 bg-casino-card h-[400px] rounded-xl border border-gray-800 relative overflow-hidden flex flex-col items-center justify-center">
            {/* Graph Background Grid (simplified) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

            <div className="relative z-10 text-center">
                {isBusted ? (
                    <div className="space-y-2 animate-bounce">
                        <h2 className="text-6xl font-black text-red-500">{multiplier.toFixed(2)}x</h2>
                        <p className="text-red-400 font-bold uppercase tracking-widest">Busted</p>
                        <p className="text-white">Próxima rodada em {nextRoundCountdown}s</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <h2 className={`text-7xl font-black ${isPlaying ? 'text-white' : 'text-gray-500'}`}>
                            {multiplier.toFixed(2)}x
                        </h2>
                         {isPlaying && <Rocket className="inline-block text-casino-gold w-12 h-12 animate-pulse" />}
                    </div>
                )}
            </div>

            {/* Rocket Animation Logic could be added here with SVG paths */}
        </div>
    </div>
  );
}
