// All text and data for Nocturne. *word* = the italic word of a heading (see Rich in components/Rich.tsx).
// Prices are samples (concept website).


export const rail = {
  chapters: [
    { id: "light", label: "Light" },
    { id: "drop", label: "Drop" },
    { id: "glass", label: "Glass" },
    { id: "skin", label: "Skin" },
    { id: "shop", label: "Shop" },
  ],
  links: [
    { label: "The scent", href: "#drop" },
    { label: "Three glasses", href: "#glass" },
    { label: "Sizes", href: "#sizes" },
    { label: "Find your night", href: "#finder" },
    { label: "Gifting", href: "#gifting" },
  ],
};

export const loader = {
  value: 22,
  unit: "%",
  label: "extrait",
  note: "Nocturne · extrait de parfum",
};

export const hero = {
  frames: "/frames/nocturne-hero",
  poster: "/images/nocturne/hero-lit.webp",
  eyebrow: "Nocturne — extrait de parfum",
  lines: ["night has", "*a scent.*"],
  sub: "Bergamot in the dark, rose through smoke, amber until morning.",
  hint: "Scroll to turn on the light",
};

export const statement = {
  text: "Some things are only *noticed* in the dark. A scent is one of them.",
  foot: "Composed for after dark · 22% concentration · lasts 10–12 hours",
};

export const drop = {
  frames: "/frames/nocturne-drop",
  eyebrow: "The scent",
  title: ["one drop,", "*three acts.*"],
  notes: [
    {
      id: "top",
      act: "Act I · Top",
      name: "Bergamot & pink pepper",
      text: "A bright, green-citrus spark with a peppered edge. The first thing they notice.",
      lasts: "First 15 minutes",
      image: "/images/nocturne/note-top.webp",
    },
    {
      id: "heart",
      act: "Act II · Heart",
      name: "Rose & smoke",
      text: "Dark rose petals held over a struck match. Soft, then not quite innocent.",
      lasts: "The first hours",
      image: "/images/nocturne/note-heart.webp",
    },
    {
      id: "base",
      act: "Act III · Base",
      name: "Amber, vanilla & oud",
      text: "Warm resin, black vanilla pod and a thread of oud. What stays on the collar.",
      lasts: "Until morning",
      image: "/images/nocturne/note-base.webp",
    },
  ],
};

export const ticker = [
  "Complimentary samples with every order",
  "Free engraving",
  "Delivered in 48 hours",
  "Discovery set ₹1,900",
  "Gift-wrapped by hand",
];

export const collection = {
  eyebrow: "The collection",
  title: ["three glasses,", "*one night.*"],
  glasses: [
    {
      id: "noir",
      name: "Noir",
      mood: "The quiet hour. Bergamot sharpened, smoke kept low.",
      notes: "Bergamot · black pepper · smoked rose · cedar",
      size: "100 ml",
      price: "₹9,800",
      half: { size: "50 ml", price: "₹6,900" },
      image: "/images/nocturne/bottle-noir.webp",
      glow: "#22304a",
      chip: "#1b2233",
    },
    {
      id: "ambre",
      name: "Ambre",
      mood: "Candlelight on skin. The house signature.",
      notes: "Pink pepper · rose · amber resin · vanilla",
      size: "100 ml",
      price: "₹9,800",
      half: { size: "50 ml", price: "₹6,900" },
      image: "/images/nocturne/bottle-ambre.webp",
      glow: "#7a4a16",
      chip: "#c9802e",
    },
    {
      id: "velours",
      name: "Velours",
      mood: "Velvet and red wine. The last one to leave.",
      notes: "Bergamot · damask rose · oud · tonka",
      size: "100 ml",
      price: "₹9,800",
      half: { size: "50 ml", price: "₹6,900" },
      image: "/images/nocturne/bottle-velours.webp",
      glow: "#6b1e2e",
      chip: "#6b1e2e",
    },
  ],
};

export const wrist = {
  eyebrow: "The ritual",
  title: ["wear it", "*close.*"],
  text: "Two sprays, twenty centimetres away. Let it dry, never rub. Warm skin does the rest.",
  image: "/images/nocturne/wrist.webp",
  points: [
    { name: "The wrist", text: "Where it meets every handshake." },
    { name: "The neck", text: "For whoever leans in." },
    { name: "Behind the ear", text: "The one place it lasts all night." },
  ],
};

export const sizes = {
  eyebrow: "Choose your size",
  title: ["the same night,", "*four ways.*"],
  items: [
    { name: "Travel spray", ml: 10, price: "₹2,400", note: "Fits a clutch" },
    { name: "Extrait", ml: 50, price: "₹6,900", note: "Most chosen" },
    { name: "Extrait", ml: 100, price: "₹9,800", note: "The full bottle" },
    { name: "Refill", ml: 200, price: "₹14,500", note: "Save 20% per ml" },
  ],
};

export const finder = {
  eyebrow: "Find your night",
  title: ["three questions,", "*one scent.*"],
  questions: [
    { q: "Where does your night begin?", options: ["A quiet room", "A late dinner", "A rooftop"], pick: 1 },
    { q: "What do you reach for?", options: ["Something fresh", "Something warm", "Something dark"], pick: 1 },
    { q: "How close?", options: ["Arm's length", "Close enough to notice", "Only you"], pick: 1 },
  ],
  result: {
    label: "Your night",
    name: "Velours",
    text: "Damask rose, oud and tonka. For dinners that turn into long walks home.",
    price: "100 ml · ₹9,800",
    image: "/images/nocturne/bottle-velours.webp",
    cta: "Try the discovery set",
  },
};

export const gifting = {
  eyebrow: "Gifting",
  title: ["for someone", "*after dark.*"],
  tiles: [
    {
      id: "discovery",
      title: "The discovery set",
      text: "Noir, Ambre and Velours in 2 ml. The full price is credited back on your first bottle.",
      price: "₹1,900",
      image: "/images/nocturne/discovery-set.webp",
    },
    { id: "engrave", title: "Free engraving", text: "An initial on the glass, by hand.", initial: "N" },
    { id: "wrap", title: "Gift-wrapped by hand", text: "Black paper, wax seal, a handwritten card.", image: "/images/nocturne/note-heart.webp" },
    { id: "samples", title: "Samples with every order", text: "Two 1 ml vials, chosen for you.", image: "/images/nocturne/note-top.webp" },
    { id: "refill", title: "Refill and save 20%", text: "Bring the bottle back, keep the glass.", image: "/images/nocturne/note-base.webp" },
  ],
};

export const reviews = {
  eyebrow: "Worn after dark",
  title: ["what they", "*remember.*"],
  items: [
    { quote: "Someone stopped me on the stairs to ask what it was. That never happens.", name: "Ishita R.", city: "Mumbai", wears: "Ambre · 50 ml" },
    { quote: "Still on my scarf the next morning. The base is ridiculous.", name: "Kabir S.", city: "Delhi", wears: "Noir · 100 ml" },
    { quote: "Velours is a whole evening in a bottle. I save it for dinners.", name: "Meher A.", city: "Bengaluru", wears: "Velours · 50 ml" },
    { quote: "Smoky, but never heavy. My partner keeps stealing it.", name: "Tara M.", city: "Hyderabad", wears: "Noir · 50 ml" },
    { quote: "Ten hours later it is still there, just softer.", name: "Vikram P.", city: "Chennai", wears: "Velours · 100 ml" },
    { quote: "The engraving made it the best gift I have ever given.", name: "Sana Q.", city: "Kolkata", wears: "Ambre · engraved" },
  ],
};

export const closing = {
  image: "/images/nocturne/closing.webp",
  lines: ["stay a little", "*longer.*"],
  cta: "Shop Nocturne",
  note: "Free delivery · samples included",
};

export const footer = {
  word: "nocturne",
  columns: [
    { title: "Shop", links: ["Noir", "Ambre", "Velours", "Discovery set"] },
    { title: "The scent", links: ["Notes", "The ritual", "Sizes", "Refills"] },
    { title: "Gifting", links: ["Engraving", "Gift wrap", "Gift cards"] },
  ],
  letter: "Letters, after dark",
  letterNote: "New nights, first. Once a month.",
  note: "Concept website by Triozen Tech. Nocturne is an invented brand; products and prices are samples.",
};
