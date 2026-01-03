"use client";

import { useState } from 'react';
import { motion, useAnimate } from 'framer-motion';
import { useWallet } from '@/context/wallet-context';

const WHEEL_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
  5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const COLORS: Record<number, string> = {
  0: 'green',
  // Red numbers
  1: 'red', 3: 'red', 5: 'red', 7: 'red', 9: 'red', 12: 'red', 14: 'red', 16: 'red',
  18: 'red', 19: 'red', 21: 'red', 23: 'red', 25: 'red', 27: 'red', 30: 'red', 32: 'red', 34: 'red', 36: 'red',
  // Black numbers (others)
};

function getNumberColor(num: number) {
  if (num === 0) return 'bg-green-600';
  if (COLORS[num] === 'red') return 'bg-red-600';
  return 'bg-gray-900';
}

export default function RouletteGame() {
  const { balance, refreshBalance } = useWallet();
  const [betAmount, setBetAmount] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [scope, animate] = useAnimate();
  const [betType, setBetType] = useState<'RED' | 'BLACK' | 'GREEN' | null>(null);

  const spin = async () => {
    if (!betType) {
        alert("Selecione uma cor para apostar!");
        return;
    }
    if (balance < betAmount) {
        alert("Saldo insuficiente");
        return;
    }

    setIsSpinning(true);
    setResult(null);

    // Deduct bet
    await fetch('/api/user/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'WITHDRAW', amount: betAmount }),
    });
    await refreshBalance();

    // Determine result
    const randomIndex = Math.floor(Math.random() * WHEEL_NUMBERS.length);
    const winningNumber = WHEEL_NUMBERS[randomIndex];

    // Animate
    // 360 * 5 full rotations + random offset
    const segmentAngle = 360 / 37;
    const targetRotation = 360 * 5 + (randomIndex * segmentAngle);

    await animate(scope.current, { rotate: targetRotation }, { duration: 3, ease: "circOut" });

    setResult(winningNumber);

    // Check win
    const winningColor = winningNumber === 0 ? 'GREEN' : COLORS[winningNumber] === 'red' ? 'RED' : 'BLACK';

    if (winningColor === betType) {
        const multiplier = betType === 'GREEN' ? 14 : 2;
        const winAmount = betAmount * multiplier;
        await fetch('/api/user/transaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'DEPOSIT', amount: winAmount }),
        });
        await refreshBalance();
    }

    setIsSpinning(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">
        <div className="w-full md:w-80 bg-casino-card p-6 rounded-xl border border-gray-800 space-y-6">
             <div>
               <label className="text-gray-400 text-sm mb-2 block">Valor da Aposta</label>
               <input
                   type="number"
                   value={betAmount}
                   onChange={(e) => setBetAmount(Number(e.target.value))}
                   disabled={isSpinning}
                   className="bg-casino-dark w-full p-2 rounded border border-gray-700 text-white"
               />
            </div>

            <div className="flex gap-2">
                <button
                   onClick={() => setBetType('RED')}
                   className={`flex-1 py-4 rounded font-bold transition-all ${betType === 'RED' ? 'bg-red-600 ring-2 ring-white' : 'bg-red-900 opacity-50 hover:opacity-100'}`}
                >
                    RED (2x)
                </button>
                 <button
                   onClick={() => setBetType('GREEN')}
                   className={`flex-1 py-4 rounded font-bold transition-all ${betType === 'GREEN' ? 'bg-green-600 ring-2 ring-white' : 'bg-green-900 opacity-50 hover:opacity-100'}`}
                >
                    0 (14x)
                </button>
                 <button
                   onClick={() => setBetType('BLACK')}
                   className={`flex-1 py-4 rounded font-bold transition-all ${betType === 'BLACK' ? 'bg-gray-900 ring-2 ring-white' : 'bg-gray-800 opacity-50 hover:opacity-100'}`}
                >
                    BLACK (2x)
                </button>
            </div>

            <button
               onClick={spin}
               disabled={isSpinning || !betType}
               className="w-full bg-casino-gold hover:bg-yellow-500 text-black font-bold py-4 rounded-lg shadow-lg disabled:opacity-50"
             >
               {isSpinning ? 'Girando...' : 'GIRAR'}
             </button>

             {result !== null && !isSpinning && (
                 <div className="text-center animate-in fade-in zoom-in">
                     <p className="text-gray-400">Resultado</p>
                     <div className={`text-4xl font-bold inline-block px-4 py-2 rounded ${getNumberColor(result)} text-white`}>
                         {result}
                     </div>
                 </div>
             )}
        </div>

        <div className="flex-1 bg-casino-card p-6 rounded-xl border border-gray-800 flex items-center justify-center relative overflow-hidden min-h-[400px]">
             {/* Simple visual representation of wheel */}
             <div className="relative w-64 h-64">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-casino-gold z-10"></div>

                 <motion.div
                   ref={scope}
                   className="w-full h-full rounded-full border-4 border-gray-700 relative overflow-hidden bg-gray-800"
                   style={{ rotate: 0 }}
                 >
                     {/* Render simplified segments */}
                     {WHEEL_NUMBERS.map((num, i) => {
                         const angle = (360 / 37) * i;
                         return (
                             <div
                               key={num}
                               className="absolute w-full h-full text-center"
                               style={{
                                   rotate: `${angle}deg`,
                               }}
                             >
                                 <div className={`w-[20px] h-[50%] mx-auto origin-bottom pt-2 text-xs font-bold text-white ${getNumberColor(num)}`}>
                                     {num}
                                 </div>
                             </div>
                         )
                     })}
                 </motion.div>
             </div>
        </div>
    </div>
  );
}
