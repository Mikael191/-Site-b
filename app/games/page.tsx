import Link from "next/link";
import { Gamepad2 } from "lucide-react";

const GAMES = [
    { name: "Crash", image: "🚀", color: "bg-red-900", href: "/games/crash" },
    { name: "Mines", image: "💣", color: "bg-blue-900", href: "/games/mines" },
    { name: "Slots", image: "🎰", color: "bg-purple-900", href: "/games/slots" },
    { name: "Roleta", image: "🎡", color: "bg-green-900", href: "/games/roleta" },
    { name: "Dice", image: "🎲", color: "bg-orange-900", href: "/games/dice" },
    { name: "Live", image: "🎥", color: "bg-pink-900", href: "/games/live" },
];

export default function GamesPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white flex items-center gap-2">
        <Gamepad2 className="text-casino-gold" />
        Todos os Jogos
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {GAMES.map((game) => (
            <Link key={game.name} href={game.href} className="group relative overflow-hidden rounded-xl aspect-[3/4] transition-all hover:ring-2 hover:ring-casino-gold hover:-translate-y-2">
              <div className={`absolute inset-0 ${game.color} opacity-60 group-hover:opacity-80 transition-opacity`}></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <span className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">{game.image}</span>
                <h3 className="text-2xl font-bold text-white tracking-wider">{game.name}</h3>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
