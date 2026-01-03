import SlotsGame from "@/components/games/slots";

export default function SlotsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Slots</h1>
      </div>
      <SlotsGame />
    </div>
  );
}
