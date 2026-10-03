import { reviews } from "../content";
import { Lines, plain } from "./Rich";
import Blotter from "./Blotter";

// "Worn after dark" reviews (Motion map M32 masonry drift). Six narrow blotter strips in three columns with wide black
// gaps (dimmer, warmer paper so they never glow like a white wall on camera); the columns move at different speeds
// (up, down, up) while you scroll (Round 3). Phone: one column of three. ?static=1: the three columns at rest.

type Review = (typeof reviews.items)[number];

function Strip({ r }: { r: Review }) {
  return (
    <Blotter className="review-strip !bg-[var(--paper-dim)] px-6 pb-10 pt-6">
      <p className="text-[12px] tracking-[0.2em] text-[#8a5a22]" aria-label="5 stars">
        ★★★★★
      </p>
      <p className="font-display mt-3 text-[clamp(22px,1.7vw,27px)] leading-[1.14]">“{r.quote}”</p>
      <p className="mt-5 text-[14px] font-medium">
        {r.name} <span className="font-normal text-[color:var(--paper-muted)]">· {r.city}</span>
      </p>
      <p className="label mt-1">{r.wears}</p>
    </Blotter>
  );
}

export default function NightNotes() {
  const cols = [0, 1, 2].map((c) => reviews.items.filter((_, i) => i % 3 === c));
  return (
    <section className="reviews relative z-[3] overflow-hidden bg-bg section-y" data-record-time="1.3" data-record-align="center" data-record-label="Reviews">
      {/* X2: a warm wash rises behind the strips as the section arrives */}
      <div aria-hidden className="reviews-wash pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_60%,rgba(122,74,22,0.16),transparent_70%)]" />
      <div className="container-x relative">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <h2 className="font-display h-lg" aria-label={plain(reviews.title)}>
            <Lines lines={reviews.title} />
          </h2>
          <p className="eyebrow mb-3">{reviews.eyebrow}</p>
        </div>

        {/* laptop: three narrow columns, wide black space between */}
        <div className="mt-16 hidden justify-between gap-x-[6vw] md:flex">
          {cols.map((col, c) => (
            <div key={c} className={`review-col flex w-[min(300px,24vw)] flex-col gap-8 ${c === 1 ? "mt-28" : ""}`} data-col={c}>
              {col.map((r) => (
                <Strip key={r.name} r={r} />
              ))}
            </div>
          ))}
        </div>
        {/* phone: one column of three */}
        <div className="mt-12 flex flex-col gap-6 px-6 md:hidden">
          {reviews.items.slice(0, 3).map((r) => (
            <Strip key={r.name} r={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
