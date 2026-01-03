import CrashGame from "@/components/games/crash";

export default function CrashPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Crash</h1>
      </div>
      <CrashGame />
    </div>
  );
}
