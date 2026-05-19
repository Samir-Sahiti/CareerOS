import { Sparkles } from "lucide-react";

interface CalibrationBadgeProps {
  fitScore: number | null;
  uncalibratedFitScore: number | null;
  historySize: number;
}

export function CalibrationBadge({
  fitScore,
  uncalibratedFitScore,
  historySize,
}: CalibrationBadgeProps) {
  // No history → no calibration applied, hide the badge
  if (historySize === 0 || fitScore == null || uncalibratedFitScore == null) {
    return null;
  }

  const delta = fitScore - uncalibratedFitScore;
  const sign = delta > 0 ? "+" : "";
  const direction = delta > 0 ? "up" : delta < 0 ? "down" : "neutral";

  const colorClasses =
    direction === "up"
      ? "border-green-500/30 bg-green-500/5 text-green-300"
      : direction === "down"
        ? "border-amber-500/30 bg-amber-500/5 text-amber-300"
        : "border-white/10 bg-white/5 text-gray-300";

  const message =
    delta === 0
      ? `No calibration adjustment from your ${historySize} prior outcome${historySize === 1 ? "" : "s"}`
      : `Adjusted ${sign}${delta} from your ${historySize} prior outcome${historySize === 1 ? "" : "s"}`;

  const tooltip =
    delta === 0
      ? "The rubric score matched what your history suggested — no adjustment."
      : delta > 0
        ? "Your historical outcomes suggested the rubric was under-scoring roles like this."
        : "Your historical outcomes suggested the rubric was over-scoring roles like this.";

  return (
    <div
      className={`inline-flex items-start gap-2 rounded-lg border px-3 py-2 ${colorClasses}`}
      title={tooltip}
    >
      <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />
      <div className="text-xs leading-relaxed">
        <p className="font-semibold">Calibrated to your history</p>
        <p className="opacity-80">{message}</p>
      </div>
    </div>
  );
}
