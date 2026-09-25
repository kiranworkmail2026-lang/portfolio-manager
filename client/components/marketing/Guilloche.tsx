/**
 * Engine-turned rosette behind the hero, in the manner of an engraved
 * certificate. Purely decorative, so it is hidden from assistive technology.
 */
export function Guilloche() {
  const outer = Array.from({ length: 60 }, (_, i) => i * 3);
  const inner = Array.from({ length: 48 }, (_, i) => i * 3.75);

  return (
    <svg className="guilloche" viewBox="-500 -500 1000 1000" aria-hidden="true" focusable="false">
      <g fill="none" stroke="#C8AB80" strokeOpacity=".16" strokeWidth=".7">
        {outer.map((deg) => (
          <ellipse key={`o${deg}`} cx="0" cy="0" rx="430" ry="150" transform={`rotate(${deg})`} />
        ))}
        {inner.map((deg) => (
          <ellipse key={`i${deg}`} cx="0" cy="0" rx="250" ry="70" transform={`rotate(${deg})`} />
        ))}
        <circle r="470" />
        <circle r="478" />
      </g>
    </svg>
  );
}
