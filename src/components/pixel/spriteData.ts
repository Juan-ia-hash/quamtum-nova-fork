// ============================================================================
// Pixel-art sprite matrices (anime chibi style) for the battle units.
// Legend per sprite is documented in each palette. " " / "." = transparent.
// Kept ~16x22 so the one-node box-shadow technique stays cheap.
// ============================================================================

export interface PixelArt {
  rows: string[];
  palette: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Shared anime chibi body template. We recolour hair/eyes/outfit per ally so
// each of the three team members reads differently while sharing the silhouette.
//   O outline  S skin  H hair  h hair-shade  E eye  W outfit-main
//   w outfit-shade  A accent (tie/badge)  B boots  G glove/skin2
// ---------------------------------------------------------------------------
function chibi(colors: {
  hair: string;
  hairShade: string;
  eye: string;
  outfit: string;
  outfitShade: string;
  accent: string;
}): PixelArt {
  const palette: Record<string, string> = {
    O: "#1a1420", // outline
    S: "#f4c9a0", // skin
    s: "#e0a97e", // skin shade
    H: colors.hair,
    h: colors.hairShade,
    E: colors.eye,
    W: colors.outfit,
    w: colors.outfitShade,
    A: colors.accent,
    B: "#2a2230", // shoes
  };

  const rows = [
    "     OOOOOO     ",
    "    OHHHHHHO    ",
    "   OHHHHHHHHO   ",
    "  OHHHHHHHHHHO  ",
    "  OHhHHHHHHhHO  ",
    "  OHSSSSSSSSHO  ",
    "  OHSESSSSESHO  ", // eyes
    "  OHSSSOOSSSHO  ",
    "   OSSSSSSSSO   ",
    "   OsSSSSSSsO   ",
    "    OOSSSSOO    ",
    "    OWWWWWWO    ", // collar/outfit top
    "   OWWWAAWWWO   ",
    "  OWWWWAAWWWWO  ",
    "  OwWWWAAWWWwO  ",
    "  OWwWWWWWWwWO  ",
    "  OSWwWWWWwWSO  ", // arms (skin) flanking body
    "  OSOwWWWWwOSO  ",
    "   OOWWwwWWOO   ",
    "    OWWOOWWO    ", // legs split
    "    OWWO OWWO   ",
    "    OBBO OBBO   ", // boots
  ];

  return { rows, palette };
}

// Hadamard — superconducting (electric blue), spiky brown-ish hair, blue eyes
export const SPRITE_CHAR_01: PixelArt = chibi({
  hair: "#8a5a3a",
  hairShade: "#5f3c25",
  eye: "#4ea8ff",
  outfit: "#2f4a6a",
  outfitShade: "#1e3148",
  accent: "#4ea8ff",
});

// Grover — trapped-ion (amber), blond hair, amber eyes, school outfit
export const SPRITE_CHAR_02: PixelArt = chibi({
  hair: "#e8c860",
  hairShade: "#b89632",
  eye: "#f4b740",
  outfit: "#3a5a3a",
  outfitShade: "#263d26",
  accent: "#f4b740",
});

// Shor — neutral-atom (teal/green), teal hair, green eyes
export const SPRITE_CHAR_03: PixelArt = chibi({
  hair: "#5fcf9a",
  hairShade: "#2f9a6a",
  eye: "#7cf29a",
  outfit: "#334a44",
  outfitShade: "#213330",
  accent: "#7cf29a",
});

// ---------------------------------------------------------------------------
// Enemy — "Regresor Determinista": a classical-ML construct (overfitted model)
// rendered as a floating distorted creature with a glitch core, echoing the
// grey flying monsters from the reference art.
//   O outline  B body  b body-shade  W wing  w wing-shade
//   C core (glitch)  E eye (red)  L leg/tendril
// ---------------------------------------------------------------------------
export const SPRITE_ENEMY: PixelArt = {
  palette: {
    O: "#0a0510",
    B: "#6b6475",
    b: "#4a4454",
    W: "#8a8296",
    w: "#5c5668",
    C: "#b4203a",
    E: "#ff3a52",
    L: "#3a3444",
  },
  rows: [
    "   W            W   ",
    "  WwW          WwW  ",
    " WwwwW        WwwwW ",
    " WwwwwW      WwwwwW ",
    "  WwwwwW    WwwwwW  ",
    "   WwwwOOOOOOwwwW   ",
    "    WwOBBBBBBBBOwW  ",
    "     OBbBCCCCbBBO   ",
    "    OBBbCCCCCCbBBO  ",
    "   OBBEBCCCCCCBEBBO ",
    "   OBBEBbCCCCbBEBBO ",
    "    OBBBbbbbbbBBBO  ",
    "     OBBbbbbbbBBO   ",
    "      OBBbbbbBBO    ",
    "       OBBBBBBO     ",
    "       OLLOOLLO     ",
    "      OLLO  OLLO    ",
    "      OLO    OLO    ",
    "      OO      OO    ",
  ],
};
