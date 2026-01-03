import LiveGame from "@/components/games/live";

export default function LivePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Cassino Ao Vivo (Simulado)</h1>
      </div>
      <LiveGame />
    </div>
  );
}
