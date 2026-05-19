"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Wand2, Loader2, Check, X, FileText, Mail, ClipboardList } from "lucide-react";

interface Props {
  jobAnalysisId: string;
}

type Step = "idle" | "tailoring" | "covering" | "tracking" | "done";

export function QuickApplyButton({ jobAnalysisId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [includeCv, setIncludeCv] = useState(true);
  const [includeCover, setIncludeCover] = useState(true);
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleApply = async () => {
    setStep(includeCv ? "tailoring" : includeCover ? "covering" : "tracking");
    setError(null);

    try {
      // Single request handles the full bundle atomically — we update the
      // visible step optimistically just to give the user a sense of progress.
      const res = await fetch("/api/applications/bundle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_analysis_id: jobAnalysisId,
          include_tailored_cv: includeCv,
          include_cover_letter: includeCover,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bundle failed");

      setStep("done");
      toast.success("Application bundle created");
      setTimeout(() => {
        router.refresh();
        setOpen(false);
        setStep("idle");
      }, 1200);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setStep("idle");
      toast.error(message);
    }
  };

  const isRunning = step !== "idle" && step !== "done";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all text-sm bg-amber-500 hover:bg-amber-400 text-stone-900"
      >
        <Wand2 className="w-4 h-4" />
        Quick Apply
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => {
            if (!isRunning) setOpen(false);
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                  Quick Apply
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Bundle the artifacts for this role in one go.
                </p>
              </div>
              {!isRunning && (
                <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="space-y-2">
              <CheckboxRow
                icon={FileText}
                label="Tailored CV"
                description="Rewrite skills + bullets for this role"
                checked={includeCv}
                onChange={setIncludeCv}
                disabled={isRunning}
                active={step === "tailoring"}
                done={includeCv && (step === "covering" || step === "tracking" || step === "done")}
              />
              <CheckboxRow
                icon={Mail}
                label="Cover letter"
                description="3-paragraph draft"
                checked={includeCover}
                onChange={setIncludeCover}
                disabled={isRunning}
                active={step === "covering"}
                done={includeCover && (step === "tracking" || step === "done")}
              />
              <CheckboxRow
                icon={ClipboardList}
                label="Track application"
                description="Always — required"
                checked={true}
                onChange={() => {}}
                disabled={true}
                active={step === "tracking"}
                done={step === "done"}
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              onClick={handleApply}
              disabled={isRunning || step === "done"}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-900 transition-colors"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Working…
                </>
              ) : step === "done" ? (
                <>
                  <Check className="w-4 h-4" />
                  Done
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Run bundle
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

interface CheckboxRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled: boolean;
  active: boolean;
  done: boolean;
}

function CheckboxRow({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
  disabled,
  active,
  done,
}: CheckboxRowProps) {
  const cursor = disabled ? "cursor-default" : "cursor-pointer";
  const borderClass = active
    ? "border-amber-500/40 bg-amber-500/5"
    : done
      ? "border-green-500/30 bg-green-500/5"
      : "border-[var(--border-subtle)] bg-white/5";

  return (
    <label
      className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 ${borderClass} ${cursor}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-1"
      />
      <Icon className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white flex items-center gap-2">
          {label}
          {active && <Loader2 className="w-3 h-3 animate-spin text-amber-400" />}
          {done && <Check className="w-3 h-3 text-green-400" />}
        </p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </label>
  );
}
