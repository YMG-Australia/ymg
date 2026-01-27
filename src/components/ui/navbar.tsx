"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { BsFacebook, BsInstagram, BsYoutube } from "react-icons/bs";
import { cormorant, inter } from "./fonts";
import ymgLogo from "../../../public/images/ymg-logo-white.png";

const navLinks = [
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

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-110">
              <Image
                src={ymgLogo}
                alt="YMG Logo"
                fill
                className="object-contain"
                placeholder="blur"
              />
            </div>
            <span className={`${cormorant.className} text-2xl font-bold text-gradient hidden sm:block`}>
              YMG
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${inter.className} relative px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg
                    ${isActive 
                      ? "text-[var(--accent-primary)]" 
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--accent-primary)]" />
                  )}
                </Link>
              );
            })}
            <Link
              href="https://www.ymgadelaide.org.au/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${inter.className} px-3 py-2 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors duration-300`}
            >
              Adelaide ↗
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--foreground-muted)] hover:text-[var(--accent-primary)] transition-all duration-300 hover:scale-110 hidden sm:block"
                aria-label={social.label}
              >
                <social.icon size={20} />
              </a>
            ))}
            {/* Mobile social icons */}
            <a
              href="https://www.instagram.com/ymgmovement/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--foreground-muted)] hover:text-[var(--accent-primary)] transition-colors sm:hidden"
              aria-label="Instagram"
            >
              <BsInstagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

