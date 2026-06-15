export const metadata = {
  title: "About | Althouse Design",
};

export default function AboutPage() {
  return (
    <div className="pt-16 min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <span className="inline-block mb-8 text-[10px] tracking-[0.3em] text-brand-terracotta uppercase border border-brand-terracotta px-4 py-1.5">
          Coming Soon
        </span>
        <h1 className="font-display text-3xl md:text-5xl tracking-[0.1em] text-brand-slate mb-6">
          About
        </h1>
        <div className="h-px w-16 bg-brand-sand mx-auto mb-6" />
        <p className="text-brand-slate/70 text-sm leading-relaxed tracking-wide">
          Althouse Design is a full-service interior design studio rooted in
          Atlanta, Georgia. We specialize in curating refined, livable spaces
          that feel distinctly personal and deeply domestic.
        </p>
        <p className="mt-4 text-brand-slate/50 text-xs tracking-[0.15em] uppercase">
          Our full story is coming soon.
        </p>
      </div>
    </div>
  );
}
