import React from "react";

const legacy = {
  "⚔️": "blade",
  "🛡️": "guardian",
  "🏹": "ranger",
  "🔮": "oracle",
  "✨": "spark",
  "🌙": "lunar",
  "⚡": "storm",
  "🧭": "scout",
};

const palette = {
  blade: { bg: "#241b45", glow: "#b99cff", metal: "#e9e4ff", dark: "#151126" },
  guardian: { bg: "#173b52", glow: "#76d8ff", metal: "#d8f5ff", dark: "#102936" },
  ranger: { bg: "#173f35", glow: "#9ee66c", metal: "#e5f6c9", dark: "#102a25" },
  oracle: { bg: "#3c1d52", glow: "#df8cff", metal: "#f5d9ff", dark: "#251132" },
  spark: { bg: "#54251f", glow: "#ffbf5c", metal: "#fff0c7", dark: "#321713" },
  lunar: { bg: "#202b4c", glow: "#b8c8ff", metal: "#e8edff", dark: "#141b31" },
  storm: { bg: "#123d50", glow: "#69e9ff", metal: "#d8fbff", dark: "#0c2733" },
  scout: { bg: "#4a3216", glow: "#ffd36a", metal: "#fff1c2", dark: "#2d1e0d" },
};

function AvatarSvg({ value = "", size = 40, className = "" }) {
  const key = palette[value] ? value : legacy[value] || "spark";
  const p = palette[key];

  const common = (
    <>
      <circle cx="32" cy="32" r="30" fill={p.bg} />
      <circle cx="32" cy="32" r="28" fill="none" stroke={p.glow} strokeWidth="1.5" opacity=".55" />
      <circle cx="32" cy="32" r="24" fill={p.dark} opacity=".42" />
    </>
  );

  const avatars = {
    blade: (
      <>
        <path d="M17 55c2-10 8-16 15-18 7 2 13 8 15 18" fill={p.metal} />
        <path d="M20 40c2-12 7-19 12-19s10 7 12 19l-6 8H26z" fill={p.dark} stroke={p.glow} strokeWidth="1.2" />
        <path d="M25 31h14l-2 8H27z" fill={p.bg} />
        <path d="M29 34h6" stroke={p.glow} strokeWidth="2" strokeLinecap="round" />
        <path d="M44 15 50 9l-3 11-7 8-3-3z" fill={p.metal} stroke={p.glow} strokeWidth="1" />
        <path d="M39 27 47 19" stroke={p.glow} strokeWidth="2" />
      </>
    ),
    guardian: (
      <>
        <path d="M14 55c3-11 10-17 18-17s15 6 18 17" fill={p.metal} />
        <path d="M18 39c0-13 6-21 14-21s14 8 14 21l-5 10H23z" fill={p.metal} stroke={p.glow} strokeWidth="1.4" />
        <path d="M23 30h18v12H23z" fill={p.dark} />
        <path d="M27 35h10" stroke={p.glow} strokeWidth="2" strokeLinecap="round" />
        <path d="M32 12 35 18h-6z" fill={p.glow} />
        <path d="M13 27l6 2-4 9-6-3zM51 27l-6 2 4 9 6-3z" fill={p.glow} opacity=".8" />
      </>
    ),
    ranger: (
      <>
        <path d="M15 55c3-10 9-15 17-17 8 2 14 7 17 17" fill={p.dark} stroke={p.glow} strokeWidth="1" />
        <path d="M16 40c2-17 9-25 16-25s14 8 16 25l-7 8H23z" fill={p.dark} />
        <path d="M22 30 32 18l10 12-3 12H25z" fill={p.metal} opacity=".9" />
        <path d="M24 31h16v9H24z" fill={p.dark} />
        <path d="M27 35h3M34 35h3" stroke={p.glow} strokeWidth="2" strokeLinecap="round" />
        <path d="M48 17 53 12l-4 13-9 9" fill="none" stroke={p.glow} strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    oracle: (
      <>
        <path d="M14 55c3-11 10-17 18-17s15 6 18 17" fill={p.metal} opacity=".9" />
        <path d="M15 42c1-18 8-28 17-28s16 10 17 28l-6 7H21z" fill={p.dark} stroke={p.glow} strokeWidth="1.2" />
        <path d="M23 30c3-7 15-7 18 0v13H23z" fill={p.metal} opacity=".9" />
        <path d="M27 35h3M34 35h3" stroke={p.bg} strokeWidth="2" strokeLinecap="round" />
        <path d="M32 10l3 6-3 7-3-7z" fill={p.glow} />
        <circle cx="32" cy="16" r="2.2" fill="#fff" />
      </>
    ),
    spark: (
      <>
        <path d="M14 55c3-11 10-17 18-17s15 6 18 17" fill={p.metal} />
        <path d="M18 43c0-14 6-22 14-22s14 8 14 22l-6 7H24z" fill={p.dark} stroke={p.glow} strokeWidth="1.3" />
        <path d="M24 31h16v11H24z" fill={p.bg} />
        <path d="M27 36h3M34 36h3" stroke={p.glow} strokeWidth="2" strokeLinecap="round" />
        <path d="M32 9l2.5 8 7.5 2.5-7.5 2.5L32 30l-2.5-8-7.5-2.5 7.5-2.5z" fill={p.glow} />
      </>
    ),
    lunar: (
      <>
        <path d="M15 55c3-10 9-16 17-17 8 1 14 7 17 17" fill={p.metal} />
        <path d="M17 43c1-16 7-24 15-24s14 8 15 24l-6 7H23z" fill={p.dark} stroke={p.glow} strokeWidth="1.2" />
        <path d="M23 31h18v11H23z" fill={p.bg} />
        <path d="M27 35h3M34 35h3" stroke={p.glow} strokeWidth="2" strokeLinecap="round" />
        <path d="M38 12c-7 1-10 10-5 15 2 2 5 3 8 2-4-2-6-5-6-9 0-3 1-6 3-8z" fill={p.glow} />
      </>
    ),
    storm: (
      <>
        <path d="M14 55c3-11 10-17 18-17s15 6 18 17" fill={p.metal} />
        <path d="M18 42c1-15 6-23 14-23s13 8 14 23l-6 8H24z" fill={p.dark} stroke={p.glow} strokeWidth="1.2" />
        <path d="M23 31h18v11H23z" fill={p.bg} />
        <path d="M27 35h3M34 35h3" stroke={p.glow} strokeWidth="2" strokeLinecap="round" />
        <path d="M34 9 25 24h7l-3 12 10-17h-7z" fill={p.glow} />
      </>
    ),
    scout: (
      <>
        <path d="M14 55c3-11 10-17 18-17s15 6 18 17" fill={p.dark} stroke={p.glow} strokeWidth="1" />
        <path d="M18 41c2-14 7-22 14-22s12 8 14 22l-6 8H24z" fill={p.metal} />
        <path d="M23 31h18v11H23z" fill={p.dark} />
        <path d="M27 35h3M34 35h3" stroke={p.glow} strokeWidth="2" strokeLinecap="round" />
        <circle cx="32" cy="12" r="5" fill="none" stroke={p.glow} strokeWidth="2" />
        <path d="M32 9v6M29 12h6" stroke={p.glow} strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
  };

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={key}
      xmlns="http://www.w3.org/2000/svg"
    >
      {common}
      {avatars[key]}
    </svg>
  );
}

export default AvatarSvg;
