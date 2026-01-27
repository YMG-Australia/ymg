import { cormorant, inter } from "@/components/ui/fonts";
import { BsEnvelope, BsFacebook, BsInstagram, BsYoutube } from "react-icons/bs";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/ymgmovement/",
    icon: BsInstagram,
    handle: "@ymgmovement",
    description: "Follow us for updates, event announcements, and daily inspiration.",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/YMGMovement",
    icon: BsFacebook,
    handle: "YMG Movement",
    description: "Join our community and connect with brothers across Australia.",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@ymgmovement6738",
    icon: BsYoutube,
    handle: "YMG Movement",
    description: "Watch our talks, testimonies, and event highlights.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-radial)] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <span className={`${inter.className} text-[var(--accent-primary)] text-sm font-semibold uppercase tracking-widest`}>
            Reach Out
          </span>
          <h1 className={`${cormorant.className} text-5xl sm:text-6xl lg:text-7xl font-bold text-[var(--foreground)] mt-4`}>
            Contact Us
          </h1>
          <p className={`${inter.className} text-xl text-[var(--foreground-muted)] mt-6 max-w-2xl mx-auto`}>
            We&apos;d love to hear from you. Whether you have questions about YMG or want to get involved, reach out through any of our channels.
          </p>
          <div className="section-divider mt-8" />
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Email Card */}
          <div className="card p-10 mb-12 text-center glow-accent">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 mb-6">
              <BsEnvelope className="text-[var(--accent-primary)] text-2xl" />
            </div>
            <h2 className={`${cormorant.className} text-3xl font-bold text-[var(--foreground)] mb-3`}>
              Email Us Directly
            </h2>
            <p className={`${inter.className} text-[var(--foreground-muted)] mb-6`}>
              Have a specific question or inquiry? Send us an email and we&apos;ll get back to you as soon as possible.
            </p>
            <a 
              href="mailto:ymgmovementaustralia@gmail.com" 
              className="btn-primary inline-block"
            >
              ymgmovementaustralia@gmail.com
            </a>
          </div>

          {/* Social Links */}
          <div className="text-center mb-10">
            <h2 className={`${cormorant.className} text-3xl font-bold text-[var(--foreground)]`}>
              Connect With Us
            </h2>
            <p className={`${inter.className} text-[var(--foreground-muted)] mt-3`}>
              Follow us on social media to stay updated
        </p>
      </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card p-8 text-center group hover:border-[var(--accent-primary)] transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--background)] border border-[var(--border-subtle)] mb-5 group-hover:border-[var(--accent-primary)] group-hover:text-[var(--accent-primary)] transition-all duration-300">
                  <social.icon className="text-2xl" />
                </div>
                <h3 className={`${cormorant.className} text-2xl font-bold text-[var(--foreground)] mb-2`}>
                  {social.name}
                </h3>
                <p className={`${inter.className} text-[var(--accent-primary)] font-medium mb-3`}>
                  {social.handle}
                </p>
                <p className={`${inter.className} text-[var(--foreground-muted)] text-sm`}>
                  {social.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Adelaide Section */}
      <section className="py-20 px-4 bg-[var(--background-secondary)]">
        <div className="max-w-4xl mx-auto text-center">
          <span className={`${inter.className} text-[var(--accent-primary)] text-sm font-semibold uppercase tracking-widest`}>
            In Adelaide?
          </span>
          <h2 className={`${cormorant.className} text-4xl sm:text-5xl font-bold text-[var(--foreground)] mt-4 mb-6`}>
            YMG Adelaide
          </h2>
          <p className={`${inter.className} text-xl text-[var(--foreground-muted)] mb-10 max-w-2xl mx-auto`}>
            Our Adelaide chapter has its own dedicated website with local events and community information.
          </p>
          <a 
            href="https://www.ymgadelaide.org.au/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Visit YMG Adelaide ↗
          </a>
        </div>
      </section>
    </div>
  );
}
