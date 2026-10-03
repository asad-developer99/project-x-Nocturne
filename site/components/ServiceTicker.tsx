import { ticker } from "../content";
import Meniscus from "./Meniscus";

// Service ticker (Motion map M14 marquee strip). Sits on the meniscus edge after the drop: the service line slides
// sideways forever (CSS .ticker-track), scrolling speeds it up (Round 3). ?static=1: the strip stands still.

export default function ServiceTicker() {
  const row = [...ticker, ...ticker];
  return (
    <section aria-label="Services" className="relative z-[3] bg-bg" data-record-time="0.8" data-record-label="Ticker">
      <Meniscus />
      <div data-hide-pill className="overflow-hidden border-y border-[rgba(236,226,208,0.08)] py-5">
        <div className="ticker-track flex w-max items-center" style={{ animationDuration: "48s" }}>
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
              {row.map((t, i) => (
                <span key={i} className="flex items-center">
                  <span className="label whitespace-nowrap px-8 text-fg">{t}</span>
                  <span className="block h-[5px] w-[5px] rounded-full bg-[var(--amber)] shadow-[0_0_10px_var(--amber)]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
