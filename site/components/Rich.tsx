import { Fragment } from "react";

/** Renders "*word*" as the italic heading word (<em>). */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/).map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? <em key={i}>{part.slice(1, -1)}</em> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}

/** A heading split into masked lines (each line can slide or rise on its own later). */
export function Lines({ lines, className = "" }: { lines: string[]; className?: string }) {
  return (
    <>
      {lines.map((l, i) => (
        <span key={i} className={`line ${className}`}>
          <span className="line-inner">
            <Rich text={l} />
          </span>
        </span>
      ))}
    </>
  );
}

/** Plain text of a "*word*" string (for aria-labels). */
export const plain = (t: string | string[]) => (Array.isArray(t) ? t.join(" ") : t).replace(/\*/g, "");
