import Link from "next/link";
import { BookOpen, ExternalLink } from "lucide-react";
import {
  LEARNING_RESOURCES,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type ResourceCategory,
  type LearningResource,
} from "@/lib/learningResources";
import { TargetHighlighter } from "@/components/resources/TargetHighlighter";

export const metadata = { title: "Learning Resources — CareerOS" };

export default function ResourcesPage() {
  const grouped: Record<ResourceCategory, LearningResource[]> = {
    language: [],
    framework: [],
    database: [],
    devops: [],
    tool: [],
    concept: [],
  };
  for (const r of LEARNING_RESOURCES) {
    grouped[r.category].push(r);
  }

  return (
    <div className="max-w-5xl mx-auto pb-24 animate-fade-in-up">
      <TargetHighlighter />
      {/* Header */}
      <div className="space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium px-3 py-1 rounded-full">
          <BookOpen className="w-3.5 h-3.5" />
          Curated learning hub
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
          Learning Resources
        </h1>
        <p className="text-gray-400 max-w-2xl">
          A short, hand-picked list of where to actually go to learn the skills that show up in your Career Ladder. No
          affiliate links, no sponsored placements — official docs, classic books, and the few free courses that are
          worth your time.
        </p>
      </div>

      {/* Category jump nav */}
      <nav className="flex flex-wrap gap-2 mb-12">
        {CATEGORY_ORDER.map((cat) => {
          const items = grouped[cat];
          if (items.length === 0) return null;
          return (
            <a
              key={cat}
              href={`#category-${cat}`}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#2d2a26] bg-[#1a1916] text-gray-400 hover:text-amber-300 hover:border-amber-500/40 transition-colors"
            >
              {CATEGORY_LABELS[cat]}
              <span className="ml-1.5 text-gray-600">{items.length}</span>
            </a>
          );
        })}
      </nav>

      {/* Sections */}
      <div className="space-y-16">
        {CATEGORY_ORDER.map((cat) => {
          const items = grouped[cat];
          if (items.length === 0) return null;
          return (
            <section key={cat} id={`category-${cat}`} className="space-y-5 scroll-mt-8">
              <h2 className="text-xl font-bold text-white uppercase tracking-widest text-gray-300">
                {CATEGORY_LABELS[cat]}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((r) => (
                  <article
                    key={r.slug}
                    id={r.slug}
                    className="target-highlight scroll-mt-8 bg-[#1a1916] border border-[#2d2a26] rounded-xl p-5 space-y-3 hover:border-amber-500/30 transition-colors"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                        {r.canonicalName}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{r.blurb}</p>
                    </div>
                    <ul className="space-y-1.5">
                      {r.links.map((l) => (
                        <li key={l.url}>
                          <Link
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 text-sm text-gray-300 hover:text-amber-300 transition-colors"
                          >
                            <span className="truncate">{l.title}</span>
                            <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-amber-400 shrink-0" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <p className="text-xs text-gray-600 mt-16 pt-6 border-t border-[#2d2a26] max-w-2xl">
        Missing a skill that&apos;s on your roadmap? This list is intentionally short — we add to it as patterns emerge
        from real user roadmaps. If something keeps coming up for you and isn&apos;t here, that&apos;s the signal to
        add it.
      </p>
    </div>
  );
}
