"use client";

import { useState } from 'react';
import { useWallet } from '@/context/wallet-context';

// Mock video stream (placeholder)
const VIDEO_URL = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzQ4ODBjZjczN2I2N2M2N2M2N2M2N2M2N2M2N2M2N2M2YiZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/3o7TKSjRrfIPjeiVyM/giphy.mp4"; // Just a loop

export default function LiveGame() {
  const { balance, refreshBalance } = useWallet();
  const [betAmount, setBetAmount] = useState(10);
  const [betChoice, setBetChoice] = useState<'PLAYER' | 'BANKER' | 'TIE' | null>(null);
  const [gameStatus, setGameStatus] = useState<'WAITING' | 'DEALING' | 'RESULT'>('WAITING');
  const [resultMessage, setResultMessage] = useState("");

  const placeBet = async (choice: 'PLAYER' | 'BANKER' | 'TIE') => {
      if (balance < betAmount) {
          alert("Saldo insuficiente");
          return;
      }

      setBetChoice(choice);

      await fetch('/api/user/transaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'WITHDRAW', amount: betAmount }),
      });
      await refreshBalance();

      // Start game sequence
      setGameStatus('DEALING');

      setTimeout(async () => {
          // Determine winner randomly
          const outcomes = ['PLAYER', 'BANKER', 'TIE'];
          const winner = outcomes[Math.floor(Math.random() * outcomes.length)];

          setGameStatus('RESULT');

          if (winner === choice) {
              const multiplier = choice === 'TIE' ? 8 : 2; // Simplified baccarat odds
              const winAmount = betAmount * multiplier;
              setResultMessage(`VENCEDOR: ${winner}! Você ganhou R$ ${winAmount}`);

              await fetch('/api/user/transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'DEPOSIT', amount: winAmount }),
              });
              await refreshBalance();
          } else {
              setResultMessage(`VENCEDOR: ${winner}. Tente novamente.`);
          }

          // Reset
          setTimeout(() => {
              setGameStatus('WAITING');
              setBetChoice(null);
              setResultMessage("");
          }, 3000);

      }, 3000); // 3 seconds dealing time
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto h-[600px]">
        {/* Video Feed Area */}
        <div className="flex-1 bg-black rounded-xl overflow-hidden relative border border-gray-800">
             <video
               src={VIDEO_URL}
               autoPlay
               loop
               muted
               className="w-full h-full object-cover opacity-60"
             />

             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 {gameStatus === 'WAITING' && (
                     <div className="bg-black/50 px-6 py-2 rounded-full text-white font-bold animate-pulse">
                         FAÇA SUAS APOSTAS
                     </div>
                 )}
                 {gameStatus === 'DEALING' && (
                     <div className="bg-casino-gold/80 px-6 py-2 rounded-full text-black font-bold">
                         DISTRIBUINDO CARTAS...
                     </div>
                 )}
                 {gameStatus === 'RESULT' && (
                     <div className="bg-casino-green/90 px-8 py-4 rounded-xl text-white font-bold text-2xl shadow-xl transform scale-110">
                         {resultMessage}
                     </div>
                 )}
             </div>

             {/* Overlay Controls */}
             <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                 <div className="flex justify-center gap-4 max-w-xl mx-auto">
                     <button
                       disabled={gameStatus !== 'WAITING'}
                       onClick={() => placeBet('PLAYER')}
                       className={`flex-1 py-4 rounded-lg font-bold border-2 transition-all ${betChoice === 'PLAYER' ? 'bg-blue-600 border-white' : 'bg-blue-900/80 border-blue-500 hover:bg-blue-800'}`}
                     >
                         PLAYER (2x)
                     </button>
                     <button
                       disabled={gameStatus !== 'WAITING'}
                       onClick={() => placeBet('TIE')}
                       className={`flex-1 py-4 rounded-lg font-bold border-2 transition-all ${betChoice === 'TIE' ? 'bg-green-600 border-white' : 'bg-green-900/80 border-green-500 hover:bg-green-800'}`}
                     >
                         TIE (8x)
                     </button>
                     <button
                       disabled={gameStatus !== 'WAITING'}
                       onClick={() => placeBet('BANKER')}
                       className={`flex-1 py-4 rounded-lg font-bold border-2 transition-all ${betChoice === 'BANKER' ? 'bg-red-600 border-white' : 'bg-red-900/80 border-red-500 hover:bg-red-800'}`}
                     >
                         BANKER (2x)
                     </button>
                 </div>
                 <div className="flex justify-center mt-4">
                     <div className="bg-black/50 rounded px-4 py-2 flex items-center gap-2">
                         <span className="text-gray-400 text-sm">Fichas:</span>
                         <input
                           type="number"
                           value={betAmount}
                           onChange={(e) => setBetAmount(Number(e.target.value))}
                           className="bg-transparent text-white w-20 text-center font-bold outline-none border-b border-gray-500 focus:border-white"
                         />
                     </div>
                 </div>
             </div>
        </div>
    </div>
  );
}
