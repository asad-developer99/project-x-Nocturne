import { statement } from "../content";
import { plain } from "./Rich";
import Meniscus from "./Meniscus";

// "Some things are only noticed in the dark." (Motion map M6 text rise from blur). Huge centred lowercase serif;
// each word (.st-word) floats up out of a blur, one after another, like scent lifting off skin. One amber hairline
// under the closing note. ?static=1: all words sharp.

export default function DarkStatement() {
  const words = statement.text.split(" ");
  let italic = false;
  return (
    // X1: the statement slides up over the last 60vh of the pinned hero (which dims under it), on a meniscus edge.
    // Phones: no overlap; the statement gets a whole screen to itself (the hero has fully left, the drop comes after)
    <section className="statement relative z-[3] bg-bg section-y md:-mt-[60vh] max-md:flex max-md:min-h-[100svh] max-md:items-center" data-record-time="2" data-record-align="center" data-record-label="Statement">
      <div className="absolute inset-x-0 top-0">
        <Meniscus />
      </div>
      <div className="container-x flex flex-col items-center text-center">
        <p className="font-display h-md max-w-[17ch] lowercase" aria-label={plain(statement.text)}>
          {words.map((w, i) => {
            if (w.startsWith("*")) italic = true;
            const isIt = italic;
            if (w.replace(/[.,]$/, "").endsWith("*")) italic = false;
            return (
              <span key={i} aria-hidden>
                <span className={`st-word inline-block ${isIt ? "it" : ""}`}>{w.replace(/\*/g, "")}</span>{" "}
              </span>
            );
          })}
        </p>
        <span className="st-line mt-12 block h-px w-24 bg-[linear-gradient(90deg,transparent,var(--amber),transparent)]" />
        <p className="label mt-6 text-muted">{statement.foot}</p>
      </div>
    </section>
  );
}
