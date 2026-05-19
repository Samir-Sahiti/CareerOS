"use client";

import { useEffect } from "react";

/**
 * Reads window.location.hash and marks the matching element with
 * data-target-active. Works around the Next.js client-side navigation case
 * where the native CSS :target pseudo-class doesn't always fire when arriving
 * at a hashed URL via router.push().
 *
 * Re-applies on hash changes (e.g. clicking the in-page category nav chips)
 * so the highlight tracks the user's navigation within the resources page.
 */
export function TargetHighlighter() {
  useEffect(() => {
    let currentEl: Element | null = null;

    const apply = () => {
      if (currentEl) {
        currentEl.removeAttribute("data-target-active");
        currentEl = null;
      }
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      const el = document.getElementById(hash);
      if (!el) return;
      el.setAttribute("data-target-active", "true");
      currentEl = el;
      // Scroll into view ourselves — Next.js client navigation occasionally
      // skips this, which is the other half of "I don't see anything".
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    apply();
    window.addEventListener("hashchange", apply);
    return () => {
      window.removeEventListener("hashchange", apply);
      if (currentEl) currentEl.removeAttribute("data-target-active");
    };
  }, []);

  return null;
}
