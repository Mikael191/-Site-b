"use client";

import { useWallet } from "@/context/wallet-context";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function WalletPage() {
  const { balance, deposit, withdraw, isLoading } = useWallet();
  const [amount, setAmount] = useState(100);

  const handleTransaction = async (type: 'DEPOSIT' | 'WITHDRAW') => {
    if (type === 'DEPOSIT') {
      await deposit(amount);
    } else {
      await withdraw(amount);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white">Carteira</h1>

      <div className="bg-casino-card p-8 rounded-xl border border-gray-800 flex flex-col items-center justify-center space-y-2">
        <span className="text-gray-400">Saldo Atual</span>
        <span className="text-5xl font-bold text-casino-gold">R$ {balance.toFixed(2)}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-casino-card p-6 rounded-xl border border-gray-800 space-y-4">
          <h2 className="text-xl font-bold text-white">Depositar</h2>
          <p className="text-sm text-gray-400">Adicione saldo fictício à sua conta.</p>

          <div className="flex flex-wrap gap-2">
            {[100, 500, 1000, 5000].map(val => (
               <button
                 key={val}
                 onClick={() => setAmount(val)}
                 className={`px-3 py-1 rounded text-sm border ${amount === val ? 'bg-casino-green text-white border-casino-green' : 'border-gray-600 text-gray-400 hover:border-gray-400'}`}
               >
                 R$ {val}
               </button>
            ))}
          </div>

          <div className="flex gap-2">
            <span className="flex items-center text-gray-400">R$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="bg-casino-dark w-full p-2 rounded border border-gray-700 text-white focus:outline-none focus:border-casino-gold"
            />
          </div>

          <button
            onClick={() => handleTransaction('DEPOSIT')}
            disabled={isLoading}
            className="w-full bg-casino-green hover:bg-casino-green-light text-white font-bold py-3 px-4 rounded transition-colors flex justify-center"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Depositar'}
          </button>
        </div>

        <div className="bg-casino-card p-6 rounded-xl border border-gray-800 space-y-4">
          <h2 className="text-xl font-bold text-white">Sacar</h2>
          <p className="text-sm text-gray-400">Remova saldo fictício da sua conta.</p>

           <div className="flex gap-2">
            <span className="flex items-center text-gray-400">R$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="bg-casino-dark w-full p-2 rounded border border-gray-700 text-white focus:outline-none focus:border-casino-gold"
            />
          </div>

          <button
             onClick={() => handleTransaction('WITHDRAW')}
             disabled={isLoading}
             className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded transition-colors flex justify-center"
          >
             {isLoading ? <Loader2 className="animate-spin" /> : 'Sacar'}
          </button>
        </div>
      </div>
    </div>
  );
}
