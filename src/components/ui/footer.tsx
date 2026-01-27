import Link from "next/link";
import { BsFacebook, BsInstagram, BsYoutube } from "react-icons/bs";
import { cormorant, inter } from "./fonts";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/donate", label: "Donate" },
  { href: "/contact-us", label: "Contact" },
];

const socialLinks = [
  { href: "https://www.facebook.com/YMGMovement", icon: BsFacebook, label: "Facebook" },
  { href: "https://www.youtube.com/@ymgmovement6738", icon: BsYoutube, label: "YouTube" },
  { href: "https://www.instagram.com/ymgmovement/", icon: BsInstagram, label: "Instagram" },
];

export const Footer = () => {
  return (
    <footer className="relative bg-[var(--background-secondary)] border-t border-[var(--border-subtle)]">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-[var(--background)] opacity-50 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quote Section */}
        <div className="text-center mb-12">
          <blockquote className={`${cormorant.className} text-2xl sm:text-3xl lg:text-4xl font-medium text-[var(--foreground)] italic max-w-3xl mx-auto leading-relaxed`}>
            "I have come that they may have life, and have it to the full."
          </blockquote>
          <cite className={`${inter.className} block mt-4 text-[var(--accent-primary)] font-medium not-italic`}>
            — John 10:10
          </cite>
        </div>

        {/* Divider */}
        <div className="section-divider mb-12" />

        {/* Links and Social */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${inter.className} text-sm text-[var(--foreground-muted)] hover:text-[var(--accent-primary)] transition-colors duration-300`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--foreground-muted)] hover:text-[var(--accent-primary)] transition-all duration-300 hover:scale-110"
                aria-label={social.label}
              >
                <social.icon size={22} />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className={`${inter.className} text-center mt-12 text-sm text-[var(--foreground-muted)]`}>
          <p>© {new Date().getFullYear()} Young Men of God Movement. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

