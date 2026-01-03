"use client";

import { useState } from 'react';
import { useWallet } from '@/context/wallet-context';

const SYMBOLS = ['🍒', '🍋', '🍇', '💎', '7️⃣'];

export default function SlotsGame() {
  const { balance, refreshBalance } = useWallet();
  const [betAmount, setBetAmount] = useState(10);
  const [reels, setReels] = useState([0, 0, 0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [win, setWin] = useState<number | null>(null);

  const spin = async () => {
    if (balance < betAmount) {
        alert("Saldo insuficiente");
        return;
    }

    setIsSpinning(true);
    setWin(null);

    await fetch('/api/user/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'WITHDRAW', amount: betAmount }),
    });
    await refreshBalance();

    // Simulation animation
    const duration = 2000;
    const interval = setInterval(() => {
        setReels(reels.map(() => Math.floor(Math.random() * SYMBOLS.length)));
    }, 100);

    setTimeout(async () => {
        clearInterval(interval);

        // Final result
        // House edge logic:
        // 10% chance to match 3 (Big Win)
        // 30% chance to match 2 (Small Win)
        // 60% loss

        const r = Math.random();
        let finalReels = [];
        let multiplier = 0;

        if (r < 0.1) {
            // Jackpot (3 same)
            const sym = Math.floor(Math.random() * SYMBOLS.length);
            finalReels = [sym, sym, sym];
            multiplier = 10;
        } else if (r < 0.4) {
             // Small win (2 same)
             const sym = Math.floor(Math.random() * SYMBOLS.length);
             const other = (sym + 1) % SYMBOLS.length;
             // Positions of pair
             finalReels = [sym, sym, other]; // Simplified for now
             multiplier = 2;
        } else {
            // Loss
            const s1 = Math.floor(Math.random() * SYMBOLS.length);
            let s2 = Math.floor(Math.random() * SYMBOLS.length);
            while (s2 === s1) s2 = Math.floor(Math.random() * SYMBOLS.length);
            const s3 = Math.floor(Math.random() * SYMBOLS.length);
            finalReels = [s1, s2, s3];
            multiplier = 0;
        }

        setReels(finalReels);

        if (multiplier > 0) {
            const winAmount = betAmount * multiplier;
            await fetch('/api/user/transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'DEPOSIT', amount: winAmount }),
            });
            await refreshBalance();
            setWin(winAmount);
        }

        setIsSpinning(false);

    }, duration);
  };

  return (
    <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto">
         <div className="bg-casino-card p-12 rounded-3xl border-4 border-casino-gold shadow-[0_0_50px_rgba(255,215,0,0.2)]">
             <div className="flex gap-4">
                 {reels.map((symbolIndex, i) => (
                     <div key={i} className="w-24 h-36 bg-white rounded-lg flex items-center justify-center text-6xl border-4 border-gray-300 shadow-inner overflow-hidden">
                         <div className={isSpinning ? 'animate-pulse blur-sm' : 'animate-bounce'}>
                            {SYMBOLS[symbolIndex]}
                         </div>
                     </div>
                 ))}
             </div>
         </div>

         {win !== null && (
             <div className="text-4xl font-bold text-casino-gold animate-bounce">
                 GANHOU R$ {win.toFixed(2)}!
             </div>
         )}

         <div className="flex gap-4 items-center bg-casino-card p-4 rounded-xl border border-gray-800">
             <div className="flex flex-col">
                 <label className="text-gray-400 text-xs">Aposta</label>
                 <input
                   type="number"
                   value={betAmount}
                   onChange={(e) => setBetAmount(Number(e.target.value))}
                   disabled={isSpinning}
                   className="bg-casino-dark p-2 rounded border border-gray-700 w-32 text-white"
                 />
             </div>
             <button
               onClick={spin}
               disabled={isSpinning}
               className="bg-casino-gold hover:bg-yellow-500 text-black font-black text-xl px-12 py-4 rounded-xl shadow-lg transform active:scale-95 transition-all"
             >
               {isSpinning ? '...' : 'GIRAR'}
             </button>
         </div>
    </div>
  );
}
