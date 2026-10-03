import type { SiteMeta, Theme } from "@/lib/site";

// Settings for THIS site: Nocturne, a (concept) luxury perfume house. One extrait in three glass colours.
// Direction + Motion map: site/DESIGN.md.

export const meta: SiteMeta = {
  name: "Nocturne",
  title: "Nocturne — night has a scent",
  description:
    "Nocturne extrait de parfum: bergamot and pink pepper, rose and smoke, amber resin, vanilla and oud. Three glasses: Noir, Ambre, Velours.",
  loaderText: "Nocturne",
  loader: false, // site/components/ConcentrationLoader.tsx replaces the engine loader
  record: { duration: 37 },
};

export const theme: Theme = {
  bg: "#0d0b0a",
  surface: "#171310",
  text: "#ece2d0",
  muted: "#a39684",
  accent: "#e9a04c",
  accentText: "#0d0b0a",
  line: "#2a241e",
  fontDisplay: "'Instrument Serif', 'Times New Roman', serif",
  fontBody: "'Instrument Sans Variable', 'Instrument Sans', system-ui, sans-serif",
  radius: 0,
  uppercaseHeadings: false,
  heroText: "#ece2d0",
};
