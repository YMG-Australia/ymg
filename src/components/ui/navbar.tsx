"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { BsFacebook, BsInstagram, BsYoutube, BsList, BsX } from "react-icons/bs";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
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

          {/* Desktop: Navigation Links */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2">
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

          {/* Desktop: Social Links */}
          <div className="hidden md:flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--foreground-muted)] hover:text-[var(--accent-primary)] transition-all duration-300 hover:scale-110"
                aria-label={social.label}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>

          {/* Mobile: Burger button */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors rounded-lg"
            aria-label="Open menu"
          >
            <BsList size={28} />
          </button>
        </div>
      </div>

      {/* Mobile menu overlay + panel */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          aria-label="Close menu"
        />
        <div
          className={`absolute top-0 right-0 bottom-0 w-full max-w-xs bg-[var(--background)] border-l border-[var(--border-subtle)] shadow-xl flex flex-col transition-transform duration-300 ease-out ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between h-20 px-4 border-b border-[var(--border-subtle)]">
            <span className={`${cormorant.className} text-xl font-bold text-[var(--foreground)]`}>Menu</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-lg"
              aria-label="Close menu"
            >
              <BsX size={28} />
            </button>
          </div>
          <div className="flex-1 overflow-auto py-6 px-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`${inter.className} block px-4 py-3 text-base font-medium rounded-lg transition-colors
                    ${isActive ? "text-[var(--accent-primary)] bg-[var(--accent-primary)]/10" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-card)]"}`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="https://www.ymgadelaide.org.au/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className={`${inter.className} block px-4 py-3 text-base font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-card)] rounded-lg transition-colors`}
            >
              Adelaide ↗
            </Link>
            <div className="mt-6 pt-6 border-t border-[var(--border-subtle)] flex gap-4 justify-center">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--foreground-muted)] hover:text-[var(--accent-primary)] transition-colors p-2"
                  aria-label={social.label}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

