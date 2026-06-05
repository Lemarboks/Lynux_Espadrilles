const values = [
  {
    title: 'Handcrafted Quality',
    description: 'Each pair made by hand with premium materials, ensuring lasting comfort and style.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-clay">
        <path d="M8 28 L6 18 Q5 14 8 12 L14 9 Q16 8 17 10 L18 14" />
        <path d="M18 14 Q19 8 22 7 Q25 6 25 10 L24 18 Q23 22 20 24 L16 28" />
        <path d="M14 9 L13 4 Q13 2 15 2 Q17 2 17 4 L17 10" />
        <circle cx="23" cy="5" r="2" />
        <path d="M22 5 L28 3" />
      </svg>
    ),
  },
  {
    title: 'Made to Order',
    description: 'Customise your size, colour and sole style. Every pair made especially for you.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-clay">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07"/>
      </svg>
    ),
  },
  {
    title: 'Free Exchange',
    description: 'Manufacturing defect? We cover the courier. Your satisfaction is our priority.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-clay">
        <polyline points="23 4 23 10 17 10"/>
        <polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
      </svg>
    ),
  },
]

export default function ValuesSection() {
  return (
    <section className="py-20 lg:py-28 bg-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {values.map(({ title, description, icon }) => (
            <div key={title} className="text-center">
              <div className="flex justify-center mb-6">
                {icon}
              </div>
              <h3 className="font-cormorant font-semibold text-2xl text-ink mb-3">
                {title}
              </h3>
              <p className="font-dm text-sm text-ink-light leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
