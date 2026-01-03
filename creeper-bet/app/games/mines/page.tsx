import MinesGame from "@/components/games/mines";

export default function MinesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Mines</h1>
      </div>
      <MinesGame />
    </div>
  );
}
