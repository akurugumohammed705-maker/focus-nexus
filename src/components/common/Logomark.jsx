export default function Logomark({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <g stroke="#E8A33D" strokeWidth="6" strokeLinecap="round" opacity="0.9">
        <line x1="100" y1="100" x2="100" y2="34" />
        <line x1="100" y1="100" x2="157" y2="67" />
        <line x1="100" y1="100" x2="157" y2="133" />
        <line x1="100" y1="100" x2="100" y2="166" />
        <line x1="100" y1="100" x2="43" y2="133" />
        <line x1="100" y1="100" x2="43" y2="67" />
      </g>
      <g fill="#161B3D">
        <circle cx="100" cy="34" r="11" />
        <circle cx="157" cy="67" r="11" />
        <circle cx="157" cy="133" r="11" />
        <circle cx="100" cy="166" r="11" />
        <circle cx="43" cy="133" r="11" />
        <circle cx="43" cy="67" r="11" />
      </g>
      <circle cx="100" cy="100" r="28" fill="#E8A33D" />
      <text
        x="100"
        y="107"
        fontFamily="'Space Grotesk'"
        fontSize="20"
        fontWeight="700"
        fill="#161B3D"
        textAnchor="middle"
      >
        FN
      </text>
    </svg>
  )
}
