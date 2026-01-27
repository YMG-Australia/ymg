import Image from "next/image";
import { cormorant, inter } from "./fonts";
import landingBanner from "../../../public/images/landing-banner.jpg";

export default function LandingBanner() {
  return (
    <section className="relative w-full h-[80vh] min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={landingBanner}
          fill
          style={{ objectFit: "cover", objectPosition: "center 70%" }}
          alt="Image of hikers on mountaintop above clouds"
          placeholder="blur"
          priority
          className="scale-105"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-transparent to-[var(--background)]" />
        <div className="absolute inset-0 bg-[var(--background)]/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        {/* Main Title */}
        <div className="opacity-0 animate-fade-in-up">
          <h1 className={`${cormorant.className} text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[var(--foreground)] tracking-tight`}>
            YOUNG MEN
          </h1>
          <h1 className={`${cormorant.className} text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gradient tracking-tight mt-2`}>
            OF GOD
          </h1>
        </div>

        {/* Divider */}
        <div className="section-divider my-8 opacity-0 animate-fade-in animate-delay-300" />

        {/* Tagline */}
        <p className={`${inter.className} max-w-2xl text-lg sm:text-xl text-[var(--foreground)] leading-relaxed opacity-0 animate-fade-in-up animate-delay-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}>
          A movement of 18-35 year old Catholic men seeking the fullness of life that only Jesus can give.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10 opacity-0 animate-fade-in-up animate-delay-500">
          <a href="/donate" className="btn-primary">
            Donate
          </a>
          <a href="/events" className="btn-secondary">
            Join an Event
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in animate-delay-500">
        <div className="w-6 h-10 border-2 border-[var(--foreground-muted)] rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-[var(--accent-primary)] rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
