import { sizes } from "../content";
import { Lines, plain } from "./Rich";
import Blotter from "./Blotter";

// "Choose your size" (Motion map M26 progress fill). Four line-drawn bottles (the real bottle's square shape and cap,
// in ivory hairline) at their relative sizes on one stone ledge. The amber liquid (.liquid) rises inside each to its
// level, 10 → 50 → 100 → 200 ml (Round 3, scrubbed). Blotter strips under each with the price.
// ?static=1: every bottle full.

const SCALE: Record<number, number> = { 10: 0.42, 50: 0.64, 100: 0.8, 200: 1 };

function Bottle({ ml, id }: { ml: number; id: string }) {
  const s = SCALE[ml] ?? 1;
  return (
    <svg viewBox="0 0 120 170" className="bottle-svg block h-auto overflow-visible" style={{ width: `calc(var(--bottle-max) * ${s})` }} aria-hidden>
      <defs>
        <clipPath id={`body-${id}`}>
          <path d="M14 46 L22 38 H98 L106 46 V160 L98 168 H22 L14 160 Z" />
        </clipPath>
        <linearGradient id={`liq-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2b562" stopOpacity=".95" />
          <stop offset=".5" stopColor="#c9792b" stopOpacity=".85" />
          <stop offset="1" stopColor="#6e3a12" stopOpacity=".95" />
        </linearGradient>
        <linearGradient id={`glass-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".10" />
          <stop offset=".35" stopColor="#fff" stopOpacity="0" />
          <stop offset=".85" stopColor="#fff" stopOpacity=".05" />
        </linearGradient>
      </defs>
      {/* liquid (fills from the bottom) */}
      <g clipPath={`url(#body-${id})`}>
        <rect className="liquid" x="0" y="58" width="120" height="112" fill={`url(#liq-${id})`} />
        <rect className="liquid-line" x="0" y="58" width="120" height="1.5" fill="#ffd9a0" opacity=".8" />
      </g>
      {/* glass body */}
      <path d="M14 46 L22 38 H98 L106 46 V160 L98 168 H22 L14 160 Z" fill={`url(#glass-${id})`} stroke="#ece2d0" strokeOpacity=".7" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      {/* neck + cap */}
      <rect x="48" y="28" width="24" height="10" fill="none" stroke="#ece2d0" strokeOpacity=".6" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <rect x="36" y="2" width="48" height="26" fill="rgba(236,226,208,0.06)" stroke="#ece2d0" strokeOpacity=".8" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <line x1="40" y1="8" x2="80" y2="8" stroke="#ece2d0" strokeOpacity=".25" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default function SizeShelf() {
  return (
    <section id="sizes" className="sizes relative z-[3] overflow-hidden bg-bg section-y" data-record-time="1.4" data-record-hold="0.4" data-record-align="center" data-record-label="Sizes">
      <span id="shop" className="absolute top-0" />
      {/* X2: the mist hands its amber to the ledge light as the section arrives */}
      <div aria-hidden className="sizes-wash pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_35%_at_50%_68%,rgba(233,160,76,0.13),transparent_70%)]" />
      <div className="container-x relative">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <h2 className="font-display h-lg" aria-label={plain(sizes.title)}>
            <Lines lines={sizes.title} />
          </h2>
          <p className="eyebrow mb-3">{sizes.eyebrow}</p>
        </div>

        <div className="mt-20 [--bottle-max:clamp(150px,15vw,250px)] max-md:[--bottle-max:150px]">
          <div className="grid grid-cols-4 items-end gap-6 px-[2vw] max-md:grid-cols-2 max-md:gap-y-14">
            {sizes.items.map((it) => (
              <div key={it.ml} className="flex flex-col items-center" data-cursor={`${it.ml} ml`}>
                <Bottle ml={it.ml} id={`b${it.ml}`} />
                <div className="ledge mt-0 w-full md:hidden" />
              </div>
            ))}
          </div>
          <div className="ledge max-md:hidden" />
          <div className="grid grid-cols-4 gap-6 px-[2vw] pt-8 max-md:hidden">
            {sizes.items.map((it) => (
              <SizeLabel key={it.ml} {...it} className="size-label-lg" />
            ))}
          </div>
          {/* phone: labels under the 2×2 grid */}
          <div className="mt-10 grid grid-cols-2 gap-4 md:hidden">
            {sizes.items.map((it) => (
              <SizeLabel key={it.ml} {...it} className="size-label-sm" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SizeLabel({ name, ml, price, note, className = "" }: { name: string; ml: number; price: string; note: string; className?: string }) {
  // the outer box rises in with the fill (SectionMotion); the strip inside swings (Details), so the two never fight
  return (
    <div className={`mx-auto w-full max-w-[220px] ${className}`}>
      <Blotter className="swing">
        <p className="label">{note}</p>
        <p className="font-display mt-2 text-[30px] leading-none">
          {ml} <span className="text-[18px]">ml</span>
        </p>
        <p className="mt-1 text-[13px]">{name}</p>
        <p className="mt-3 flex items-center justify-between border-t border-[rgba(26,21,18,0.15)] pt-3 text-[15px] font-medium">
          {price}
          <span className="label !tracking-[0.18em]">Add +</span>
        </p>
      </Blotter>
    </div>
  );
}
