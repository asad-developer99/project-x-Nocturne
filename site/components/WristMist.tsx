import { wrist } from "../content";
import Meniscus from "./Meniscus";
import MistCanvas from "./MistCanvas";
import { Lines, plain } from "./Rich";

// "Wear it close" (Motion map M15 glow particles, as mist). Wide split: the wrist photo (tall) on the left, the
// headline and the three pulse points on the right. A canvas (.mist-canvas) over the whole section lets ~70 fine
// amber mist particles leave the atomizer and drift across the gap toward the headline (Round 3; paused off
// screen). ?static=1: photo + copy, no particles.

export default function WristMist() {
  return (
    <section id="skin" className="wrist relative z-[4] bg-bg section-y lg:-mt-[25vh]" data-record-time="1.4" data-record-hold="0.4" data-record-align="center" data-record-label="Wrist">
      {/* X1: on laptops this section slides up over the last glass while the collection is still pinned */}
      <div className="absolute inset-x-0 top-0">
        <Meniscus />
      </div>
      <MistCanvas />
      <div className="container-x relative grid items-center gap-x-[6vw] gap-y-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
        <div className="relative">
          <img src={wrist.image} alt="Nocturne sprayed on the inside of a wrist" className="wrist-img breathe aspect-[3/4] w-full object-cover lg:h-[84vh] lg:w-auto" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent_60%,rgba(13,11,10,0.5))]" />
        </div>
        <div className="relative z-[3] max-w-[560px]">
          <p className="eyebrow">{wrist.eyebrow}</p>
          <h2 className="font-display h-xl mt-6" aria-label={plain(wrist.title)}>
            <Lines lines={wrist.title} />
          </h2>
          <p className="mt-8 max-w-[40ch] text-[17px] leading-relaxed text-muted">{wrist.text}</p>
          <ol className="mt-12 border-t border-line">
            {wrist.points.map((p, i) => (
              <li key={p.name} className="flex items-baseline gap-6 border-b border-line py-5">
                <span className="label text-[color:var(--amber-soft)]">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-[30px] leading-none">{p.name}</span>
                <span className="ml-auto text-right text-[14px] text-muted max-sm:hidden">{p.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
