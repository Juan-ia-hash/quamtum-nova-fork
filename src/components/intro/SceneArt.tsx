import { useId } from "react";
import styles from "./intro.module.css";

function Scientist({ x, y, warrior = false }: { x: number; y: number; warrior?: boolean }) {
  return <g transform={`translate(${x} ${y})`}><g className={styles.figure}>
    <path d="M-22 114 -16 48 Q0 31 16 48 L23 114 13 114 8 72 7 144 -5 144 -9 83 -12 114Z" fill="#0c1831" stroke="#7dd3fc" strokeWidth="1.5" />
    <path d={warrior ? "M-25 51 -13 40 15 40 26 52 17 71 -17 71Z" : "M-17 49 0 71 18 49 25 113 -24 113Z"} fill={warrior ? "#243369" : "#a8bed8"} fillOpacity=".65" stroke="#a5b4fc" />
    <circle cy="24" r="15" fill="#101b38" stroke="#8b9cce" strokeWidth="2" />
    <path d="M-11 22H11" stroke="#22d3ee" strokeWidth="5" />
    <path d="M-5 54 0 63 5 54" fill="none" stroke="#22d3ee" strokeWidth="3" />
    {warrior && <path d="M28 48 44 -8 49 -6 36 53Z" fill="#7c3aed" stroke="#22d3ee" />}
  </g></g>;
}

export function SceneArt({ scene }: { scene: number }) {
  const id = useId().replace(/:/g, "");
  const paint = (name: string) => `url(#${id}-${name})`;
  const conflict = scene === 2;
  const agency = scene === 3;
  const anomaly = scene === 4;
  const rebellion = scene === 5;
  const final = scene === 6;
  return (
    <svg className={styles.spaceArt} data-art-scene={scene} viewBox="0 0 800 680" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`${id}-planet`}><stop stopColor="#050816" offset=".48" /><stop stopColor="#17235b" offset=".81" /><stop stopColor="#7c3aed" offset=".94" /><stop stopColor="#a5f3fc" offset="1" /></radialGradient>
        <radialGradient id={`${id}-goldPlanet`}><stop stopColor="#191221" offset=".4" /><stop stopColor="#854329" offset=".86" /><stop stopColor="#facc15" offset="1" /></radialGradient>
        <radialGradient id={`${id}-cyanPlanet`}><stop stopColor="#061a29" offset=".4" /><stop stopColor="#136487" offset=".86" /><stop stopColor="#22d3ee" offset="1" /></radialGradient>
        <radialGradient id={`${id}-pinkPlanet`}><stop stopColor="#180c2e" offset=".4" /><stop stopColor="#762c74" offset=".86" /><stop stopColor="#ec4899" offset="1" /></radialGradient>
        <radialGradient id={`${id}-halo`}><stop stopColor="var(--accent)" stopOpacity=".25" /><stop offset="1" stopColor="var(--accent)" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="405" cy="325" r="320" fill={paint("halo")} />
      <g className={styles.orbit}>
        <ellipse cx="410" cy="330" rx="300" ry="225" stroke="var(--accent)" strokeOpacity=".13" strokeDasharray="3 12" />
        <ellipse cx="410" cy="330" rx="270" ry="170" stroke="var(--accent)" strokeOpacity=".22" transform="rotate(-28 410 330)" />
        <path d="M105 330H715M410 65V595" stroke="var(--accent)" strokeOpacity=".08" />
      </g>

      {(scene <= 2 || final) && <>
        <g className={styles.planetFloat}>
          <circle cx="425" cy="320" r={final ? 145 : 125} fill={paint("planet")} />
          <ellipse cx="425" cy="320" rx="172" ry="47" stroke="#a5b4fc" strokeWidth="2" strokeOpacity=".65" transform="rotate(-30 425 320)" />
          <path d="M345 292Q410 250 481 292M330 327Q409 364 505 314M362 385Q417 354 479 367" stroke="#22d3ee" strokeOpacity=".3" strokeWidth="2" />
          <circle cx="425" cy="320" r="156" stroke="var(--accent)" strokeOpacity=".18" strokeDasharray="45 9 2 9" />
        </g>
        {[{ x: 171, y: 174, r: 49 }, { x: 647, y: 164, r: 65 }, { x: 192, y: 488, r: 63 }, { x: 648, y: 481, r: 39 }].map((p, i) => <g key={i} className={styles.satellite} style={{ animationDelay: `${-i * 2}s` }}>
          <circle cx={p.x} cy={p.y} r={p.r + 16} fill={paint("halo")} />
          <circle cx={p.x} cy={p.y} r={p.r} fill={paint(["cyanPlanet", "pinkPlanet", "goldPlanet", "planet"][i])} />
          <ellipse cx={p.x} cy={p.y} rx={p.r * 1.35} ry={p.r * .32} stroke={i % 2 ? "#ec4899" : "#22d3ee"} strokeOpacity=".55" transform={`rotate(-25 ${p.x} ${p.y})`} />
        </g>)}
        {(scene === 1 || conflict) && <g className={styles.connections} stroke={conflict ? "#ef4444" : "#facc15"} strokeWidth="2">
          <path d="M171 174 425 320 647 164M192 488 425 320 648 481" strokeDasharray="8 8" />
          {[171, 425, 647].map((x, i) => <ellipse key={x} cx={x} cy={i === 1 ? 320 : 174} rx="20" ry="65" strokeWidth="5" />)}
        </g>}
        {scene === 1 && <g><path d="M270 568 425 489 580 568 425 620Z" fill="#0e1935" stroke="#22d3ee" /><ellipse cx="425" cy="519" rx="63" ry="25" stroke="#facc15" strokeWidth="3" /><path d="M375 515V451L425 421 475 451V515" fill="#22d3ee" fillOpacity=".08" stroke="#22d3ee" strokeDasharray="5 5" /><Scientist x={315} y={445} /><Scientist x={535} y={445} /></g>}
        {conflict && <g stroke="#ef4444"><circle className={styles.shockwave} cx="425" cy="320" r="175" /><path d="m250 280 30 -35 52 10 -35 12Zm270 170 40 -35 40 10 -39 10ZM500 120l28 -24 28 10 -28 8" fill="#61283e" /><path d="m290 255 96 45m180 130 -92 -74m50 -238 -60 130" strokeWidth="3" /></g>}
      </>}

      {agency && <g className={styles.station}>
        <ellipse cx="409" cy="353" rx="252" ry="90" stroke="#ef4444" strokeWidth="2" />
        <path d="M144 327 350 278 410 159 468 278 676 327 676 366 469 408 410 495 351 408 144 366Z" fill="#101529" stroke="#9f4555" strokeWidth="2" />
        <path d="M144 327 350 342 410 221 469 342 676 327M350 342V408M469 342V408M410 221V460" stroke="#ef4444" strokeOpacity=".7" strokeWidth="2" />
        <path d="m410 278 48 83 -48 38 -48 -38Z" fill="#ef4444" fillOpacity=".1" stroke="#ef4444" strokeWidth="3" />
        <path d="m410 302 25 49h-50Z" stroke="#fecaca" strokeWidth="3" />
        {[190, 230, 270, 510, 550, 590].map(x => <path key={x} d={`M${x} 342v21`} stroke="#ef4444" strokeWidth="5" />)}
        <path d="M238 498h96v54h-96zM479 498h96v54h-96z" fill="#ef4444" fillOpacity=".08" stroke="#ef4444" />
        <Scientist x={285} y={495} /><Scientist x={525} y={495} />
        <text x="410" y="110" textAnchor="middle" fill="#ef4444" fontSize="13" letterSpacing="6">ACU · CONTROL UNIVERSAL</text>
      </g>}

      {anomaly && <g>
        <path d="M90 430 325 430 440 330 700 330M325 430 450 510 700 510" stroke="#22d3ee" strokeWidth="4" />
        <path className={styles.connections} d="M325 430 440 215 620 160" stroke="#facc15" strokeWidth="4" strokeDasharray="10 5" />
        <circle className={styles.shockwave} cx="325" cy="430" r="38" stroke="#facc15" strokeWidth="2" />
        <circle cx="325" cy="430" r="9" fill="#facc15" />
        <circle cx="625" cy="160" r="75" fill={paint("planet")} />
        <circle cx="625" cy="160" r="94" stroke="#ef4444" strokeWidth="2" strokeDasharray="25 8" />
        <path d="M530 65 720 255M720 65 530 255" stroke="#ef4444" strokeWidth="3" />
        <text x="90" y="477" fill="#22d3ee" fontSize="12" letterSpacing="3">REALIDAD / 01</text>
        <text x="470" y="570" fill="#ef4444" fontSize="12" letterSpacing="3">NUEVA REALIDAD / 02</text>
        <text x="625" y="290" textAnchor="middle" fill="#ef4444" fontSize="13" letterSpacing="3">ELIMINAR</text>
      </g>}

      {rebellion && <g>
        <circle cx="410" cy="290" r="150" stroke="#7c3aed" strokeWidth="2" />
        <path d="m410 149 86 145 -86 66 -86 -66Z" fill="#7c3aed" fillOpacity=".12" stroke="#22d3ee" strokeWidth="3" />
        <path d="m388 248 36 -43 -9 59h30l-48 65 15 -60h-28" fill="#22d3ee" />
        <ellipse cx="410" cy="527" rx="224" ry="38" fill={paint("halo")} stroke="#7c3aed" />
        <Scientist x={280} y={357} /><Scientist x={410} y={339} warrior /><Scientist x={540} y={357} warrior />
        {[204, 575].map((x, i) => <g key={x} transform={`translate(${x} ${285 + i * 24}) rotate(${i ? 15 : -15})`}><g className={styles.hologram}><rect width="55" height="85" rx="6" fill="#22d3ee" fillOpacity=".12" stroke="#22d3ee" /><circle cx="27" cy="29" r="13" stroke="#a5b4fc" /><path d="M10 56h35M10 65h24" stroke="#22d3ee" /></g></g>)}
      </g>}

      {final && <g className={styles.bot}>
        <ellipse cx="575" cy="569" rx="90" ry="14" fill="#22d3ee" fillOpacity=".12" />
        <path d="m557 433 18 -31 18 31" stroke="#22d3ee" strokeWidth="3" /><circle cx="575" cy="403" r="5" fill="#22d3ee" />
        <rect x="512" y="434" width="126" height="83" rx="28" fill="#172447" stroke="#a5f3fc" strokeWidth="3" />
        <rect x="526" y="450" width="98" height="43" rx="18" fill="#050816" />
        <path d="M543 468h14M590 468h14" stroke="#22d3ee" strokeWidth="7" strokeLinecap="round" />
        <path d="m567 484 8 4 8 -4" stroke="#22d3ee" strokeWidth="2" />
        <path d="M552 523h46l-23 24Z" fill="#22d3ee" fillOpacity=".6" />
        <text x="575" y="602" textAnchor="middle" fill="#22d3ee" fontSize="12" letterSpacing="5">Q-BOT / ONLINE</text>
      </g>}
      <g stroke="var(--accent)" strokeOpacity=".6"><path d="M80 110V80h30M690 80h30v30M80 550v30h30M690 580h30v-30" /><path d="M400 80h20M410 70v20M400 580h20M410 570v20" /></g>
    </svg>
  );
}
