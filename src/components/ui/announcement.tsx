"use client";

import { cormorant, inter } from "./fonts";

export default function Announcement() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-xl mx-auto text-center">
        {/* Heading */}
        <h2 className={`${cormorant.className} text-4xl sm:text-5xl font-bold text-[var(--foreground)] mb-8`}>
          🚨 New YMG Event! 🚨
        </h2>

        {/* Image */}
        {/* <div className="card overflow-hidden mb-8">
          <CldImage
            alt="YMG Melbourne Conference 2026"
            src="ymgPowerVertical_w56fyd"
            width={600}
            height={600}
            placeholder="blur"
            blurDataURL={getBlurDataUrl("ymgPowerVertical_w56fyd")}
            className="w-full h-auto"
          />
        </div> */}
        <h1 className={`${cormorant.className} text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-8`}>
          Trivia Night Fundraiser - Hosted by YMG
        </h1>

        {/* Description */}
        <p className={`${inter.className} text-[var(--foreground-muted)] leading-relaxed mb-8`}>
          Join us for a fun-filled trivia night fundraiser on Saturday 21 November 2026 at St Scholastica&apos;s School Hall in Bennettswood. Expect trivia, games, food, raffles and prizes while helping raise funds for mission work in Manila and Mindoro.
        </p>

        {/* Sign Up Button */}
        <a
          href="https://www.trybooking.com/au/event/young-men-of-god-trivia-night-1660083"
          target="_blank"
          rel="noreferrer"
          className="btn-primary inline-block"
        >
          Get Tickets
        </a>
      </div>
    </section>
  );
}
