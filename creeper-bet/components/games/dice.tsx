"use client";

import { useState } from 'react';
import { useWallet } from '@/context/wallet-context';

export default function DiceGame() {
  const { balance, refreshBalance } = useWallet();
  const [betAmount, setBetAmount] = useState(10);
  const [winChance, setWinChance] = useState(50);
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [lastWin, setLastWin] = useState<boolean | null>(null);

  const multiplier = 99 / winChance; // Simplified logic: 99 / chance = multiplier (house edge included implicitly if max is 100)

  const roll = async () => {
    if (balance < betAmount) {
        alert("Saldo insuficiente");
        return;
    }

    setIsRolling(true);
    setRollResult(null);
    setLastWin(null);

    // Deduct bet
    await fetch('/api/user/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'WITHDRAW', amount: betAmount }),
    });
    await refreshBalance();

    // Simulate delay
    setTimeout(async () => {
        const result = Math.random() * 100;
        setRollResult(result);

        const win = result < winChance;
        setLastWin(win);

        if (win) {
            const winAmount = betAmount * multiplier;
            await fetch('/api/user/transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'DEPOSIT', amount: winAmount }),
            });
            await refreshBalance();
        }

        setIsRolling(false);
    }, 500);
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
                   disabled={isRolling}
                   className="bg-casino-dark w-full p-2 rounded border border-gray-700 text-white"
               />
            </div>

             <button
               onClick={roll}
               disabled={isRolling}
               className="w-full bg-casino-green hover:bg-casino-green-light text-white font-bold py-4 rounded-lg shadow-lg transition-all active:scale-95"
             >
               {isRolling ? 'Rolando...' : 'Apostar'}
             </button>

             <div className="bg-casino-dark p-4 rounded text-center">
                 <p className="text-gray-400 text-xs uppercase">Multiplicador</p>
                 <p className="text-xl font-bold text-white">x{multiplier.toFixed(4)}</p>
             </div>
              <div className="bg-casino-dark p-4 rounded text-center">
                 <p className="text-gray-400 text-xs uppercase">Chance de Vitória</p>
                 <p className="text-xl font-bold text-white">{winChance}%</p>
             </div>
        </div>

        <div className="flex-1 bg-casino-card p-12 rounded-xl border border-gray-800 flex flex-col items-center justify-center relative overflow-hidden space-y-12">

             <div className="relative w-full h-12 bg-gray-700 rounded-full overflow-hidden">
                 {/* Success Range */}
                 <div
                   className="absolute left-0 top-0 bottom-0 bg-green-500 transition-all duration-300"
                   style={{ width: `${winChance}%` }}
                 ></div>

                 {/* Slider Thumb (Input) */}
                 <input
                   type="range"
                   min="1"
                   max="98"
                   value={winChance}
                   onChange={(e) => setWinChance(Number(e.target.value))}
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                   disabled={isRolling}
                 />

                 {/* Result Indicator */}
                 {rollResult !== null && (
                     <div
                       className="absolute top-0 bottom-0 w-1 bg-white z-20 transition-all duration-500 ease-out shadow-[0_0_10px_white]"
                       style={{ left: `${rollResult}%` }}
                     >
                         <div className={`absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 rounded font-bold text-white ${lastWin ? 'bg-green-500' : 'bg-red-500'}`}>
                             {rollResult.toFixed(2)}
                         </div>
                     </div>
                 )}
             </div>

             <div className="text-center space-y-2">
                 <h2 className="text-6xl font-black text-white">
                     {rollResult !== null ? rollResult.toFixed(2) : "00.00"}
                 </h2>
                 {lastWin !== null && (
                     <p className={`text-xl font-bold ${lastWin ? 'text-green-500' : 'text-red-500'}`}>
                         {lastWin ? `GANHOU R$ ${(betAmount * multiplier).toFixed(2)}` : 'PERDEU'}
                     </p>
                 )}
             </div>

             <p className="text-gray-400 text-sm">Arraste a barra para ajustar sua chance de vitória</p>
        </div>
    </div>
  );
}
