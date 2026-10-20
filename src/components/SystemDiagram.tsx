const services = [
  { label: "order-svc", y: 70 },
  { label: "payment-svc", y: 158 },
  { label: "notify-svc", y: 246 },
];

const flows = [
  { id: "p-in", d: "M110 180 H150", dur: 1.2, begin: 0 },
  { id: "p-gw", d: "M250 180 H290", dur: 1.2, begin: 0.6 },
  { id: "p-s0", d: "M360 180 H375 Q385 180 385 170 V102 Q385 92 395 92 H410", dur: 1.6, begin: 1.2 },
  { id: "p-s1", d: "M360 180 H410", dur: 1.6, begin: 1.6 },
  { id: "p-s2", d: "M360 180 H375 Q385 180 385 190 V258 Q385 268 395 268 H410", dur: 1.6, begin: 2 },
  { id: "p-rd", d: "M200 202 V262", dur: 1.4, begin: 0.9 },
];

export default function SystemDiagram() {
  return (
    <svg className="diagram" viewBox="0 0 530 340" role="img" aria-label="Animated diagram of an event-driven backend: client, API gateway, Kafka and three services, with Redis cache">
      <defs>
        <linearGradient id="kafka-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.04" />
        </linearGradient>
        <radialGradient id="dot-glow">
          <stop offset="0%" stopColor="var(--gold)" />
          <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {flows.map((f) => (
        <path key={f.id} id={f.id} d={f.d} className="wire" />
      ))}

      <g className="node">
        <rect x="10" y="158" width="100" height="44" rx="10" />
        <text x="60" y="185">client</text>
      </g>
      <g className="node">
        <rect x="150" y="158" width="100" height="44" rx="10" />
        <text x="200" y="185">api-gateway</text>
      </g>
      <g className="node node-soft">
        <rect x="150" y="262" width="100" height="44" rx="10" />
        <text x="200" y="289">redis</text>
      </g>

      <g className="node node-kafka">
        <rect x="290" y="40" width="70" height="280" rx="14" fill="url(#kafka-grad)" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1="302" x2="348" y1={92 + i * 36} y2={92 + i * 36} />
        ))}
        <text x="325" y="68" className="kafka-label">kafka</text>
      </g>

      {services.map((s) => (
        <g className="node" key={s.label}>
          <rect x="410" y={s.y} width="110" height="44" rx="10" />
          <circle cx="426" cy={s.y + 22} r="3.5" className="status" />
          <text x="472" y={s.y + 27}>{s.label}</text>
        </g>
      ))}

      {flows.map((f) => (
        <g key={`dot-${f.id}`}>
          <circle r="9" fill="url(#dot-glow)" opacity="0.6">
            <animateMotion dur={`${f.dur}s`} begin={`${f.begin}s`} repeatCount="indefinite">
              <mpath href={`#${f.id}`} />
            </animateMotion>
          </circle>
          <circle r="2.6" className="packet">
            <animateMotion dur={`${f.dur}s`} begin={`${f.begin}s`} repeatCount="indefinite">
              <mpath href={`#${f.id}`} />
            </animateMotion>
          </circle>
        </g>
      ))}
    </svg>
  );
}
