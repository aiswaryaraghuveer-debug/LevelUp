import React from "react";

const designs = {
  blade: { bg:"#6d54d9", accent:"#ffcf5c", glyph:"⚔" },
  guardian: { bg:"#3d78a8", accent:"#9de7ff", glyph:"🛡" },
  ranger: { bg:"#4f9667", accent:"#d6f38a", glyph:"➶" },
  oracle: { bg:"#8c4fa6", accent:"#e7b5ff", glyph:"✦" },
  spark: { bg:"#d7654c", accent:"#ffe18a", glyph:"✧" },
  lunar: { bg:"#445477", accent:"#d9e7ff", glyph:"☾" },
  storm: { bg:"#327b9c", accent:"#b9f4ff", glyph:"ϟ" },
  scout: { bg:"#b97718", accent:"#ffe6a4", glyph:"⌖" },
};

function AvatarSvg({ value="", size=40, className="" }) {
  const legacy = { "⚔️":"blade","🛡️":"guardian","🏹":"ranger","🔮":"oracle","✨":"spark","🌙":"lunar","⚡":"storm","🧭":"scout" };
  const key = designs[value] ? value : legacy[value] || "spark";
  const d = designs[key];
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={key}>
      <defs><linearGradient id={`avatar-${key}`} x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor={d.bg}/><stop offset="1" stopColor={d.accent}/></linearGradient></defs>
      <circle cx="32" cy="32" r="29" fill={`url(#avatar-${key})`} />
      <circle cx="32" cy="27" r="12" fill="rgba(255,255,255,.92)" />
      <path d="M14 54c3-12 10-18 18-18s15 6 18 18" fill="rgba(255,255,255,.88)" />
      <text x="32" y="31" textAnchor="middle" fontSize="14" fontWeight="700" fill={d.bg}>{d.glyph}</text>
    </svg>
  );
}
export default AvatarSvg;
