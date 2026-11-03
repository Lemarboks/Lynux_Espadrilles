const promises = [
  { icon: '◇', label: 'Handcrafted with care' },
  { icon: '↗', label: 'R65 flat-rate delivery' },
  { icon: '↻', label: 'Free defect exchanges' },
]

export default function TrustStrip() {
  return (
    <div className="trust-strip font-dm" aria-label="Our commitments">
      {promises.map(p => (
        <span key={p.label}>
          <i aria-hidden>{p.icon}</i> {p.label}
        </span>
      ))}

      <style>{`
        .trust-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          padding: 15px max(5vw, 24px);
          border-bottom: 1px solid #DFCFC4;
          background: #F8F0EA;
        }
        .trust-strip span {
          display: flex;
          align-items: center;
          justify-self: center;
          gap: 12px;
          width: 100%;
          max-width: 240px;
          color: #1D1B19;
          font-size: 10px;
        }
        .trust-strip span + span { padding-left: 21px; border-left: 1px solid #DFCFC4; }
        .trust-strip i {
          display: inline-grid;
          place-items: center;
          width: 25px;
          height: 25px;
          font-size: 19px;
          font-style: normal;
        }
        @media (max-width: 680px) {
          .trust-strip { grid-template-columns: 1fr; padding: 7px 23px; }
          .trust-strip span { max-width: none; min-height: 42px; }
          .trust-strip span + span { padding-left: 0; border-left: 0; border-top: 1px solid #DFCFC4; }
        }
      `}</style>
    </div>
  )
}
