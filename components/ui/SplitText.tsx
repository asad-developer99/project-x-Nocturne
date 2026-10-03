import { createElement, type ElementType } from "react";

/**
 * Renders text as masked words for the word-by-word reveal.
 * Wrap words in *stars* to highlight them in the accent colour.
 */
export default function SplitText({
  text,
  as = "h2",
  className = "",
}: {
  text: string;
  as?: ElementType;
  className?: string;
}) {
  const plain = text.replace(/\*/g, "");
  const words = text.split(/(\s+)/);
  let highlighted = false;

  return createElement(
    as,
    { className, "data-split": "", "aria-label": plain },
    words.map((w, i) => {
      if (/^\s+$/.test(w)) return " ";
      const starts = w.startsWith("*");
      const ends = w.replace(/[.,!?;:]+$/, "").endsWith("*");
      if (starts) highlighted = true;
      const isHi = highlighted;
      if (ends) highlighted = false;
      return (
        <span key={i} className="split-word" aria-hidden>
          <span className={isHi ? "highlight" : undefined}>{w.replace(/\*/g, "")}</span>
        </span>
      );
    }),
  );
}
