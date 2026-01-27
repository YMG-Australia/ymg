"use client";

import { CldImage, getCldImageUrl } from "next-cloudinary";
import { cormorant, inter } from "@/components/ui/fonts";

// Generate blur placeholder URL using Cloudinary transformations
function getBlurDataUrl(src: string): string {
  return getCldImageUrl({
    src,
    width: 10,
    height: 10,
    quality: 1,
    effects: [{ blur: "1000" }],
  });
}

export default function EventsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-10 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-radial)] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className={`${cormorant.className} text-4xl sm:text-5xl font-bold text-[var(--foreground)] mt-3`}>
        YMG Events
          </h1>
          <div className="section-divider mt-5" />
        </div>
      </section>

      {/* Event Images */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* YMG Sundays - first on mobile */}
            <div className="card overflow-hidden">
              <CldImage
                alt="YMG Sundays Event"
                src="ymgSundaysPosterJan26_krqkme"
                width={600}
                height={600}
                placeholder="blur"
                blurDataURL={getBlurDataUrl("ymgSundaysPosterJan26_krqkme")}
                className="w-full h-auto"
              />
            </div>
            {/* YMG Philippines */}
            <div className="card overflow-hidden">
          <CldImage
                alt="YMG Philippines 2026"
                src="ymgPhillipines26_lp6i8t"
                width={600}
                height={600}
                placeholder="blur"
                blurDataURL={getBlurDataUrl("ymgPhillipines26_lp6i8t")}
                className="w-full h-auto"
          />
        </div>
            {/* YMG Melbourne Conference */}
            <div className="card overflow-hidden">
          <CldImage
                alt="YMG Melbourne Conference 2026"
                src="ymgPowerVertical_w56fyd"
                width={600}
                height={600}
                placeholder="blur"
                blurDataURL={getBlurDataUrl("ymgPowerVertical_w56fyd")}
                className="w-full h-auto"
          />
        </div>
      </div>
        </div>
      </section>
    </div>
  );
}
