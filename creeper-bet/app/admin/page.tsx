"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface AdminData {
    users: {
        id: string;
        email: string;
        balance: number;
        role: string;
    }[];
    transactions: {
        id: string;
        user: { email: string };
        type: string;
        amount: number;
    }[];
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) {
        fetch('/api/admin/dashboard')
          .then(async res => {
              if (res.ok) return res.json();
              if (res.status === 403) throw new Error("Acesso Negado. Você não é Admin.");
              throw new Error("Erro ao carregar dados.");
          })
          .then(setData)
          .catch(e => setError(e.message));
    }
  }, [session]);

  if (error) return <div className="p-8 text-red-500 font-bold text-center">{error}</div>;
  if (!data) return <div className="p-8 text-white text-center">Carregando painel administrativo...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-casino-card p-6 rounded-xl border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4">Usuários Recentes</h2>
              <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-400">
                      <thead className="text-xs text-gray-500 uppercase bg-gray-900">
                          <tr>
                              <th className="px-4 py-3">Email</th>
                              <th className="px-4 py-3">Saldo</th>
                              <th className="px-4 py-3">Role</th>
                          </tr>
                      </thead>
                      <tbody>
                          {data.users.map((user) => (
                              <tr key={user.id} className="border-b border-gray-800">
                                  <td className="px-4 py-3">{user.email}</td>
                                  <td className="px-4 py-3 font-bold text-casino-gold">R$ {user.balance.toFixed(2)}</td>
                                  <td className="px-4 py-3">{user.role}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>

          <div className="bg-casino-card p-6 rounded-xl border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4">Últimas Transações</h2>
              <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-400">
                      <thead className="text-xs text-gray-500 uppercase bg-gray-900">
                          <tr>
                              <th className="px-4 py-3">User</th>
                              <th className="px-4 py-3">Tipo</th>
                              <th className="px-4 py-3">Valor</th>
                          </tr>
                      </thead>
                      <tbody>
                          {data.transactions.map((tx) => (
                              <tr key={tx.id} className="border-b border-gray-800">
                                  <td className="px-4 py-3">{tx.user.email.split('@')[0]}</td>
                                  <td className={`px-4 py-3 ${tx.type === 'DEPOSIT' || tx.type === 'WIN' ? 'text-green-500' : 'text-red-500'}`}>{tx.type}</td>
                                  <td className="px-4 py-3">R$ {tx.amount.toFixed(2)}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
    </div>
  );
}
