import { cormorant, inter } from "./fonts";

export default function OurMission() {
    return (
    <section id="mission" className="relative py-24 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[var(--gradient-radial)] pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto text-center">
        {/* Section Label */}
        <span className={`${inter.className} text-[var(--accent-primary)] text-sm font-semibold uppercase tracking-widest`}>
          What We Stand For
        </span>

        {/* Title */}
        <h2 className={`${cormorant.className} text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--foreground)] mt-4 mb-6`}>
          Our Mission
        </h2>

        {/* Divider */}
        <div className="section-divider mb-10" />

        {/* Mission Statement */}
        <p className={`${inter.className} text-xl sm:text-2xl text-[var(--foreground-muted)] leading-relaxed max-w-3xl mx-auto`}>
          To disciple and equip young men with the truth of the gospel for personal growth in Christ, and in brotherhood and evangelisation.
        </p>

        {/* Decorative elements */}
        <div className="flex justify-center gap-8 mt-12">
          <div className="card p-6 text-center flex-1 max-w-[200px]">
            <div className="text-3xl mb-3">✝️</div>
            <h3 className={`${cormorant.className} text-lg font-semibold text-[var(--foreground)]`}>Faith</h3>
          </div>
          <div className="card p-6 text-center flex-1 max-w-[200px]">
            <div className="text-3xl mb-3">🤝</div>
            <h3 className={`${cormorant.className} text-lg font-semibold text-[var(--foreground)]`}>Brotherhood</h3>
          </div>
          <div className="card p-6 text-center flex-1 max-w-[200px]">
            <div className="text-3xl mb-3">🔥</div>
            <h3 className={`${cormorant.className} text-lg font-semibold text-[var(--foreground)]`}>Mission</h3>
          </div>
        </div>

        {/* Donate CTA */}
        <div className="mt-14">
          <p className={`${inter.className} text-[var(--foreground-muted)] mb-4`}>
            Support our mission
          </p>
          <a href="/donate" className="btn-primary">
            Donate
          </a>
        </div>
      </div>
      </section>
    );
  }
