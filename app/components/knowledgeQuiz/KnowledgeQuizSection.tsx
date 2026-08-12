import { BrainCircuit } from "lucide-react";
import KqSportsPanel from "./KqSportsPanel";

export const QUERY_KQ_TAB = "kqTab";

export default function KnowledgeQuizSection() {
  return (
    <div className="p-6">
      <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
        <BrainCircuit className="h-6 w-6 text-cyan-400" />
        Knowledge Quiz
      </h2>
      <div className="mt-5">
        <KqSportsPanel />
      </div>
    </div>
  );
}
