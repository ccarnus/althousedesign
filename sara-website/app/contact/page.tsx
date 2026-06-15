export const metadata = {
  title: "Contact | Althouse Design",
};

export default function ContactPage() {
  return (
    <div className="pt-16 min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-xl w-full text-center">
        <span className="inline-block mb-8 text-[10px] tracking-[0.3em] text-brand-terracotta uppercase border border-brand-terracotta px-4 py-1.5">
          Coming Soon
        </span>
        <h1 className="font-display text-3xl md:text-5xl tracking-[0.1em] text-brand-slate mb-6">
          Contact
        </h1>
        <div className="h-px w-16 bg-brand-sand mx-auto mb-6" />
        <p className="text-brand-slate/70 text-sm leading-relaxed tracking-wide mb-10">
          We would love to hear about your project. Our full contact page is
          launching soon — in the meantime, reach us at:
        </p>
        <a
          href="mailto:hello@althousedesign.com"
          className="text-xs tracking-[0.2em] text-brand-terracotta uppercase hover:text-brand-slate transition-colors"
        >
          hello@althousedesign.com
        </a>
      </div>
    </div>
  );
}
