"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-brand-cream/85 backdrop-blur-sm border-b border-brand-sand/60">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-sm md:text-base tracking-[0.25em] text-brand-slate uppercase hover:text-brand-terracotta transition-colors"
        >
          Althouse Design
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-10">
          {links.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-xs tracking-[0.2em] text-brand-slate uppercase hover:text-brand-terracotta transition-colors relative after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-px after:bg-brand-terracotta after:transition-all hover:after:w-full"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
        >
          <span
            className={`block w-6 h-px bg-brand-slate transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block w-6 h-px bg-brand-slate transition-opacity ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-px bg-brand-slate transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-brand-cream border-t border-brand-sand/60 px-6 py-6 flex flex-col gap-6">
          {links.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="text-xs tracking-[0.2em] text-brand-slate uppercase hover:text-brand-terracotta transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
