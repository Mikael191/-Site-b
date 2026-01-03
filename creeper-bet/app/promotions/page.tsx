import { Gift, Percent, Calendar } from "lucide-react";

export default function PromotionsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white flex items-center gap-2">
        <Gift className="text-casino-gold" />
        Promoções
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Welcome Bonus */}
        <div className="bg-gradient-to-br from-green-900 to-black p-6 rounded-xl border border-green-700 flex flex-col justify-between h-64">
           <div>
               <div className="bg-green-500 w-fit p-2 rounded-lg mb-4 text-black">
                   <Gift size={24} />
               </div>
               <h2 className="text-2xl font-bold text-white mb-2">Bônus de Boas-vindas</h2>
               <p className="text-gray-300">Receba R$ 1.000,00 fictícios instantaneamente ao se cadastrar na Creeper Bet.</p>
           </div>
           <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded transition-colors mt-4">
               Já Recebido
           </button>
        </div>

        {/* Cashback */}
        <div className="bg-gradient-to-br from-purple-900 to-black p-6 rounded-xl border border-purple-700 flex flex-col justify-between h-64">
           <div>
               <div className="bg-purple-500 w-fit p-2 rounded-lg mb-4 text-white">
                   <Percent size={24} />
               </div>
               <h2 className="text-2xl font-bold text-white mb-2">Cashback Semanal</h2>
               <p className="text-gray-300">Receba 10% de volta das suas perdas toda segunda-feira.</p>
           </div>
           <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded transition-colors mt-4">
               Ativar
           </button>
        </div>

        {/* Daily Drops */}
        <div className="bg-gradient-to-br from-orange-900 to-black p-6 rounded-xl border border-orange-700 flex flex-col justify-between h-64">
           <div>
               <div className="bg-orange-500 w-fit p-2 rounded-lg mb-4 text-white">
                   <Calendar size={24} />
               </div>
               <h2 className="text-2xl font-bold text-white mb-2">Prêmios Diários</h2>
               <p className="text-gray-300">Entre todo dia para girar a roda da fortuna e ganhar prêmios.</p>
           </div>
           <button className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded transition-colors mt-4">
               Em Breve
           </button>
        </div>

      </div>
    </div>
  );
}
