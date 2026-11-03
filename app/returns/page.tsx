export const metadata = {
  title: 'Returns — Lynux Espadrilles',
  description: 'Our returns and exchange policy.',
}

const sections = [
  {
    title: 'Made to order',
    body: 'As all our espadrilles are handcrafted to order, we do not accept returns for change of mind. Please ensure you select the correct size and customisation options before placing your order.',
  },
  {
    title: 'Manufacturing defects',
    body: 'If you receive a pair with a manufacturing defect, we will arrange a free exchange at no cost to you. We cover the courier for all defect exchanges.',
  },
  {
    title: 'Our promise',
    body: 'Your satisfaction is our priority. We stand behind the quality of every pair we make. If something isn’t right, we want to make it right.',
  },
]

export default function ReturnsPage() {
  return (
    <div className="font-dm">
      <section className="lx-banner">
        <h1 className="lx-page-title text-ink">Returns &amp; exchanges</h1>
        <p>Our policy</p>
      </section>

      <section className="lx-policy lx-container">
        {sections.map(s => (
          <div key={s.title} className="lx-policy-row">
            <h2 className="font-cormorant">{s.title}</h2>
            <p>{s.body}</p>
          </div>
        ))}
        <div className="lx-policy-row">
          <h2 className="font-cormorant">How to contact us</h2>
          <p>
            For any returns or exchange queries, email{' '}
            <a href="mailto:info@lynuxespadrilles.co.za" className="lx-text-link">info@lynuxespadrilles.co.za</a>
          </p>
        </div>
      </section>

      <style>{`
        .lx-policy { max-width: 820px; padding: 55px 0 90px; }
        .lx-policy-row { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 24px; padding: 22px 0; border-top: 1px solid #DFCFC4; }
        .lx-policy-row:last-child { border-bottom: 1px solid #DFCFC4; }
        .lx-policy-row h2 { margin: 0; font-size: 26px; font-weight: 400; line-height: 1.1; }
        .lx-policy-row p { margin: 0; color: var(--color-ink-light); font-size: 13px; line-height: 1.7; }
        .lx-policy-row .lx-text-link { color: var(--color-ink); font-size: 13px; }
        @media (max-width: 680px) {
          .lx-policy { padding: 35px 0 60px; }
          .lx-policy-row { grid-template-columns: 1fr; gap: 8px; }
        }
      `}</style>
    </div>
  )
}
