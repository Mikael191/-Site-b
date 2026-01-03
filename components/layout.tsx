import React from 'react';
import Link from 'next/link';
import { Home, Gamepad2, Gift, CreditCard, Menu, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar({ className }: { className?: string }) {
  return (
    <div className={cn("h-screen w-64 bg-casino-dark border-r border-gray-800 flex flex-col fixed left-0 top-0 z-40 hidden md:flex", className)}>
      <div className="p-6 flex items-center justify-center border-b border-gray-800">
        <h1 className="text-2xl font-bold text-casino-gold tracking-tighter">CREEPER BET</h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Menu</p>
        </div>
        <ul className="space-y-1 px-2">
          <li>
            <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-casino-green hover:text-white rounded-lg transition-colors">
              <Home size={20} />
              <span>Início</span>
            </Link>
          </li>
          <li>
            <Link href="/games" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-casino-green hover:text-white rounded-lg transition-colors">
              <Gamepad2 size={20} />
              <span>Jogos</span>
            </Link>
          </li>
          <li>
            <Link href="/promotions" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-casino-green hover:text-white rounded-lg transition-colors">
              <Gift size={20} />
              <span>Promoções</span>
            </Link>
          </li>
        </ul>

        <div className="px-4 mt-6 mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Conta</p>
        </div>
        <ul className="space-y-1 px-2">
          <li>
            <Link href="/wallet" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-casino-green hover:text-white rounded-lg transition-colors">
              <CreditCard size={20} />
              <span>Carteira</span>
            </Link>
          </li>
          <li>
            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-casino-green hover:text-white rounded-lg transition-colors">
              <User size={20} />
              <span>Perfil</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-casino-card p-4 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">Seu Saldo</p>
          <p className="text-xl font-bold text-casino-gold">R$ 0,00</p>
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  return (
    <header className="h-16 bg-casino-dark border-b border-gray-800 flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 left-0 md:left-64 z-30">
      <div className="flex items-center gap-4 md:hidden">
        <Menu className="text-gray-300" />
        <span className="font-bold text-casino-gold">CREEPER BET</span>
      </div>

      <div className="hidden md:block">
        {/* Breadcrumbs or Page Title could go here */}
      </div>

      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
          Entrar
        </Link>
        <Link href="/register" className="bg-casino-green hover:bg-casino-green-light text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          Cadastrar
        </Link>
      </div>
    </header>
  );
}

export function MobileNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-casino-dark border-t border-gray-800 flex justify-around p-3 z-50">
      <Link href="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-casino-gold">
        <Home size={20} />
        <span className="text-[10px]">Início</span>
      </Link>
      <Link href="/games" className="flex flex-col items-center gap-1 text-gray-400 hover:text-casino-gold">
        <Gamepad2 size={20} />
        <span className="text-[10px]">Jogos</span>
      </Link>
      <Link href="/wallet" className="flex flex-col items-center gap-1 text-gray-400 hover:text-casino-gold">
        <CreditCard size={20} />
        <span className="text-[10px]">Carteira</span>
      </Link>
      <Link href="/profile" className="flex flex-col items-center gap-1 text-gray-400 hover:text-casino-gold">
        <User size={20} />
        <span className="text-[10px]">Perfil</span>
      </Link>
    </div>
  );
}
