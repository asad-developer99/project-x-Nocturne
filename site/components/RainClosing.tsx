import { closing } from "../content";
import { Lines, plain } from "./Rich";

// Closing "stay a little longer" (Motion map M37 breathing light). The bottle on a rainy night window ledge (photo
// right), the final line + "Shop Nocturne" on the left over a smoke gradient. The city lights behind the glass
// (.city-glow) and a warm glow on the bottle (.bottle-glow) slowly brighten and dim (Round 3); rain streaks run down
// the glass (.rain). ?static=1: everything at rest.

export default function RainClosing() {
  return (
    <section className="closing relative z-[3] h-[100svh] min-h-[640px] overflow-hidden bg-bg" data-record-time="2.2" data-record-hold="0.6" data-hold-push=".closing-push" data-record-label="Closing">
      {/* laptop: full bleed. Phone: the whole bottle with headroom in the top half (bottle centred), text below */}
      <div className="closing-push absolute inset-0">
        <div className="breathe absolute inset-0">
          <img src={closing.image} alt="A Nocturne bottle on a rainy night window ledge, city lights behind" className="closing-img closing-media absolute object-cover" />
        </div>
      </div>
      <div aria-hidden className="city-glow pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_55%_at_30%_35%,rgba(255,190,110,0.18),transparent_70%)] mix-blend-screen" />
      <div aria-hidden className="bottle-glow pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_18%_30%_at_76%_66%,rgba(233,160,76,0.22),transparent_70%)] mix-blend-screen max-md:bg-[radial-gradient(ellipse_34%_18%_at_50%_34%,rgba(233,160,76,0.22),transparent_70%)]" />
      <div aria-hidden className="rain pointer-events-none absolute inset-0 max-md:bottom-[42%]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(13,11,10,0.92)_0%,rgba(13,11,10,0.7)_30%,rgba(13,11,10,0.1)_58%,transparent_70%)] max-md:bg-none" />

      <div className="container-x relative z-[2] flex h-full flex-col justify-center max-md:justify-end max-md:pb-16">
        <h2 className="font-display h-xl" aria-label={plain(closing.lines)}>
          <Lines lines={closing.lines} />
        </h2>
        <div className="closing-cta mt-12 flex flex-wrap items-center gap-6">
          <span data-magnet className="inline-block">
            <a href="#glass" className="btn btn-solid" data-cursor="Shop">
              {closing.cta}
            </a>
          </span>
          <span className="label text-muted">{closing.note}</span>
        </div>
      </div>
    </section>
  );
}
