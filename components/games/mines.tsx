"use client";

import { useState } from 'react';
import { useWallet } from '@/context/wallet-context';
import { Bomb, Gem } from 'lucide-react';

export default function MinesGame() {
  const { balance, refreshBalance } = useWallet();
  const [betAmount, setBetAmount] = useState(10);
  const [minesCount, setMinesCount] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [revealed, setRevealed] = useState<boolean[]>(Array(25).fill(false));
  const [minesLocations, setMinesLocations] = useState<number[]>([]);
  const [profit, setProfit] = useState(0);

  // Multiplier logic (simplified)
  const calculateMultiplier = (hits: number, mines: number) => {
    // Basic probability math for multiplier
    // P = (25-mines)! / (25-mines-hits)! * (25-hits)! / 25! ... simplified:
    let m = 1;
    for(let i=0; i<hits; i++) {
        m *= (25 - i) / (25 - mines - i);
    }
    return m;
  };

  const currentMultiplier = calculateMultiplier(revealed.filter(r => r).length, minesCount);
  const nextMultiplier = calculateMultiplier(revealed.filter(r => r).length + 1, minesCount);

  const startGame = async () => {
    if (balance < betAmount) {
      alert("Saldo insuficiente");
      return;
    }

    // Deduct bet immediately (optimistic) or via API
    // Ideally call API to start game session
    const res = await fetch('/api/user/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'WITHDRAW', amount: betAmount }), // Bet is a "withdraw" until win
    });

    if(!res.ok) {
        alert("Erro ao apostar");
        return;
    }

    await refreshBalance();

    // Generate mines
    const newMines: number[] = [];
    while(newMines.length < minesCount) {
        const r = Math.floor(Math.random() * 25);
        if(!newMines.includes(r)) newMines.push(r);
    }
    setMinesLocations(newMines);
    setRevealed(Array(25).fill(false));
    setIsPlaying(true);
    setGameOver(false);
    setGameWon(false);
    setProfit(0);
  };

  const cashOut = async () => {
    const winAmount = betAmount * currentMultiplier;

    const res = await fetch('/api/user/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'DEPOSIT', amount: winAmount }),
    });

    if(res.ok) {
        await refreshBalance();
        setGameWon(true);
        setIsPlaying(false);
        setProfit(winAmount - betAmount);
        revealAll();
    }
  };

  const revealAll = () => {
     setRevealed(Array(25).fill(true));
  };

  const handleTileClick = (index: number) => {
    if (!isPlaying || revealed[index] || gameOver || gameWon) return;

    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    if (minesLocations.includes(index)) {
      // Boom
      setGameOver(true);
      setIsPlaying(false);
      revealAll();
    } else {
      // Gem
      // Check if all non-mines are revealed? (Optional auto-win)
      const nonMinesCount = 25 - minesCount;
      const revealedCount = newRevealed.filter(r => r).length;
      if (revealedCount === nonMinesCount) {
          cashOut();
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">
      {/* Controls */}
      <div className="w-full md:w-80 bg-casino-card p-6 rounded-xl border border-gray-800 space-y-6 h-fit">
        <div>
           <label className="text-gray-400 text-sm mb-2 block">Valor da Aposta</label>
           <div className="flex gap-2 mb-2">
             <input
               type="number"
               value={betAmount}
               onChange={(e) => setBetAmount(Number(e.target.value))}
               disabled={isPlaying}
               className="bg-casino-dark w-full p-2 rounded border border-gray-700 text-white"
             />
             <button onClick={() => setBetAmount(betAmount / 2)} disabled={isPlaying} className="px-3 bg-gray-700 rounded text-xs">½</button>
             <button onClick={() => setBetAmount(betAmount * 2)} disabled={isPlaying} className="px-3 bg-gray-700 rounded text-xs">2x</button>
           </div>
        </div>

        <div>
            <label className="text-gray-400 text-sm mb-2 block">Número de Minas: {minesCount}</label>
            <input
              type="range"
              min="1"
              max="24"
              value={minesCount}
              onChange={(e) => setMinesCount(Number(e.target.value))}
              disabled={isPlaying}
              className="w-full accent-casino-green"
            />
        </div>

        {!isPlaying ? (
             <button
               onClick={startGame}
               className="w-full bg-casino-green hover:bg-casino-green-light text-white font-bold py-4 rounded-lg shadow-lg shadow-green-900/20 transition-all active:scale-95"
             >
               Começar o Jogo
             </button>
        ) : (
            <div className="space-y-4">
                <div className="text-center p-4 bg-casino-dark rounded-lg border border-casino-gold/30">
                    <p className="text-gray-400 text-xs uppercase tracking-widest">Lucro Atual</p>
                    <p className="text-2xl font-bold text-casino-gold">{(betAmount * currentMultiplier).toFixed(2)}</p>
                    <p className="text-xs text-green-500">x{currentMultiplier.toFixed(2)}</p>
                </div>
                <button
                  onClick={cashOut}
                  className="w-full bg-casino-gold hover:bg-yellow-500 text-black font-bold py-4 rounded-lg shadow-lg shadow-yellow-900/20 transition-all active:scale-95"
                >
                  Sacar
                </button>
                 <div className="text-center text-xs text-gray-500">Próximo: x{nextMultiplier.toFixed(2)}</div>
            </div>
        )}
      </div>

      {/* Game Board */}
      <div className="flex-1 bg-casino-card p-6 rounded-xl border border-gray-800 flex items-center justify-center relative overflow-hidden">
         {gameOver && (
             <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                 <div className="bg-red-900/90 p-8 rounded-xl text-center border border-red-500 transform scale-110">
                     <Bomb size={64} className="mx-auto text-white mb-4" />
                     <h2 className="text-3xl font-bold text-white mb-2">BoooM!</h2>
                     <p className="text-red-200">Você perdeu R$ {betAmount.toFixed(2)}</p>
                 </div>
             </div>
         )}

         {gameWon && profit > 0 && (
             <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                 <div className="bg-green-900/90 p-8 rounded-xl text-center border border-green-500 transform scale-110">
                     <Gem size={64} className="mx-auto text-white mb-4" />
                     <h2 className="text-3xl font-bold text-white mb-2">Vitória!</h2>
                     <p className="text-green-200">Você ganhou R$ {(betAmount + profit).toFixed(2)}</p>
                 </div>
             </div>
         )}

         <div className="grid grid-cols-5 gap-3 w-full max-w-[500px] aspect-square">
            {Array.from({ length: 25 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleTileClick(i)}
                  disabled={revealed[i] || gameOver || gameWon || !isPlaying}
                  className={`
                    relative rounded-lg transition-all duration-300 transform
                    ${!revealed[i]
                        ? 'bg-casino-dark hover:bg-gray-700 shadow-[0_4px_0_0_rgba(0,0,0,0.3)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.3)] hover:translate-y-[2px]'
                        : 'bg-[#0f2a3d] shadow-none translate-y-[4px]'
                    }
                    ${revealed[i] && minesLocations.includes(i) ? 'bg-red-900/50' : ''}
                    ${revealed[i] && !minesLocations.includes(i) ? 'bg-green-900/50' : ''}
                  `}
                >
                    {revealed[i] && (
                        <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in duration-300">
                            {minesLocations.includes(i) ? (
                                <Bomb className="text-red-500 w-1/2 h-1/2" />
                            ) : (
                                <Gem className="text-green-400 w-1/2 h-1/2" />
                            )}
                        </div>
                    )}
                </button>
            ))}
         </div>
      </div>
    </div>
  );
}
