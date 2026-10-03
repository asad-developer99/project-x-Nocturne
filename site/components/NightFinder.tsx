import { finder } from "../content";
import { Lines, plain } from "./Rich";
import Blotter from "./Blotter";

// "Find your night" scent finder (Motion map M21 typewriter / caret). Hands-free: each question types itself with a
// blinking caret, an answer chip gets picked by itself, then "Your night: Velours" types out and its card appears
// (Round 3). ?static=1: all questions typed, the picks made, the result shown.

export default function NightFinder() {
  return (
    <section id="finder" className="finder relative z-[3] bg-bg section-y" data-record-time="1.5" data-record-hold="1.2" data-record-align="center" data-record-label="Finder">
      <div className="container-x grid gap-x-[6vw] gap-y-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        <div>
          <p className="eyebrow">{finder.eyebrow}</p>
          <h2 className="font-display h-md mt-6" aria-label={plain(finder.title)}>
            <Lines lines={finder.title} />
          </h2>
          <ol className="mt-14 space-y-10">
            {finder.questions.map((q, i) => (
              <li key={i} className="finder-q border-t border-line pt-6">
                <p className="flex items-baseline gap-5">
                  <span className="label text-[color:var(--amber-soft)]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-[clamp(26px,2.3vw,38px)] leading-tight">
                    <span className="type-text" data-text={q.q}>
                      {q.q}
                    </span>
                    {i === finder.questions.length - 1 && <span className="caret" aria-hidden />}
                  </span>
                </p>
                <div className="mt-5 flex flex-wrap gap-3 pl-[46px] max-sm:pl-0">
                  {q.options.map((o, k) => (
                    <span key={o} className={`chip ${k === q.pick ? "is-picked" : ""}`} data-pick={k === q.pick || undefined}>
                      {o}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* result card: tall photo + blotter strip */}
        <div className="finder-result self-end">
          <p className="label text-muted">
            {finder.result.label}:{" "}
            <span className="type-text font-display text-[28px] normal-case italic tracking-normal text-fg" data-text={finder.result.name}>
              {finder.result.name}
            </span>
          </p>
          <div className="finder-card">
          <div className="relative mt-5">
            <img src={finder.result.image} alt={`Nocturne ${finder.result.name}`} className="glass-photo aspect-[3/4] w-full object-cover" />
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_50%_55%,rgba(107,30,46,0.35),transparent_70%)] mix-blend-screen" />
          </div>
          <Blotter className="swing relative -mt-10 ml-auto mr-6 w-[min(260px,80%)] rotate-[-2deg]">
            <p className="text-[14px] leading-snug">{finder.result.text}</p>
            <p className="mt-3 text-[14px] font-medium">{finder.result.price}</p>
          </Blotter>
          <a href="#gifting" className="underline-once label mt-8 inline-block text-fg">
            {finder.result.cta} →
          </a>
          </div>
        </div>
      </div>
    </section>
  );
}
