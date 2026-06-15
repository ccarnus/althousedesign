import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-slate py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-brand-cream/60">
        <Link
          href="/"
          className="font-display text-sm tracking-[0.25em] text-brand-cream uppercase hover:text-brand-sand transition-colors"
        >
          Althouse Design
        </Link>

        <p className="text-xs tracking-[0.15em] text-center">
          Expertly sourced. Distinctly Domestic. Atlanta Interiors.
        </p>

        <p className="text-xs tracking-widest">
          © {new Date().getFullYear()} Althouse Design
        </p>
      </div>
    </footer>
  );
}
