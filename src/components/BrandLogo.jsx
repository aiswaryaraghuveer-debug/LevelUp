import React from "react";

function BrandLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 512 512" aria-hidden="true">
      <defs>
        <linearGradient id="arise-portal" x1="76" y1="101" x2="437" y2="424" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--pink-dark)" />
          <stop offset=".5" stopColor="var(--pink)" />
          <stop offset="1" stopColor="var(--brand-name)" />
        </linearGradient>
        <linearGradient id="arise-crest" x1="153" y1="95" x2="365" y2="422" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--brand-name)" />
          <stop offset=".52" stopColor="var(--pink)" />
          <stop offset="1" stopColor="var(--orange)" />
        </linearGradient>
        <linearGradient id="arise-orbit" x1="83" y1="355" x2="426" y2="241" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--pink-dark)" />
          <stop offset=".52" stopColor="var(--pink)" />
          <stop offset="1" stopColor="var(--orange)" />
        </linearGradient>
      </defs>
      <circle className="brand-icon-frame" cx="256" cy="256" r="185" />
      <path className="brand-icon-crest" fill="url(#arise-crest)" fillRule="evenodd" d="M256 98 399 412H113L256 98ZM256 221 212 310H300L256 221Z" />
      <path className="brand-icon-crossbar" d="M185 350H327L311 316H201L185 350Z" />
      <ellipse className="brand-icon-orbit" cx="256" cy="326" rx="198" ry="38" transform="rotate(-17 256 326)" />
      <path className="brand-icon-spark" d="M256 20 266 54 300 64 266 74 256 108 246 74 212 64 246 54 256 20Z" />
    </svg>
  );
}

export default BrandLogo;