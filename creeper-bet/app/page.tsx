import Link from "next/link";
import { Gamepad2, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-casino-green to-black h-[300px] flex items-center p-8 md:p-12">
        <div className="z-10 max-w-xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Sinta a emoção do <span className="text-casino-gold">Creeper Bet</span>
          </h1>
          <p className="text-gray-200 text-lg">
            Jogue seus jogos favoritos com dinheiro fictício. Divirta-se sem riscos!
          </p>
          <div className="flex gap-4 pt-2">
            <Link href="/register" className="bg-casino-gold hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105">
              Começar Agora
            </Link>
          </div>
        </div>
        {/* Decorative elements could go here */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[url('https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mask-image-linear-gradient"></div>
      </section>

      {/* Featured Games */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Gamepad2 className="text-casino-gold" />
            Jogos em Destaque
          </h2>
          <Link href="/games" className="text-sm text-casino-green-light hover:text-casino-gold flex items-center gap-1 transition-colors">
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { name: "Crash", image: "🚀", color: "bg-red-900" },
            { name: "Mines", image: "💣", color: "bg-blue-900" },
            { name: "Slots", image: "🎰", color: "bg-purple-900" },
            { name: "Roleta", image: "🎡", color: "bg-green-900" },
            { name: "Dice", image: "🎲", color: "bg-orange-900" },
            { name: "Live", image: "🎥", color: "bg-pink-900" },
          ].map((game) => (
            <Link key={game.name} href={`/games/${game.name.toLowerCase()}`} className="group relative overflow-hidden rounded-xl aspect-[3/4] transition-all hover:ring-2 hover:ring-casino-gold">
              <div className={`absolute inset-0 ${game.color} opacity-60 group-hover:opacity-80 transition-opacity`}></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <span className="text-5xl mb-2 transform group-hover:scale-110 transition-transform duration-300">{game.image}</span>
                <h3 className="text-xl font-bold text-white">{game.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
