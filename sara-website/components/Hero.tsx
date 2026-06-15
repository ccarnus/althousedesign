import Image from "next/image";
import { heroImage } from "@/lib/images";
import EmailSignup from "./EmailSignup";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Badge */}
        <span className="inline-block mb-8 px-5 py-1.5 border border-brand-terracotta text-brand-terracotta text-[10px] tracking-[0.3em] uppercase">
          Coming Soon
        </span>

        {/* Brand */}
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-brand-cream tracking-[0.12em] leading-tight mb-5">
          Althouse Design
        </h1>

        {/* Tagline */}
        <p className="text-brand-sand text-xs md:text-sm tracking-[0.25em] uppercase mb-10 leading-relaxed">
          Expertly sourced.&nbsp;&nbsp;Distinctly Domestic.&nbsp;&nbsp;Atlanta Interiors.
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4 justify-center mb-10">
          <div className="h-px w-12 bg-brand-sand/40" />
          <div className="w-1 h-1 rounded-full bg-brand-terracotta" />
          <div className="h-px w-12 bg-brand-sand/40" />
        </div>

        {/* Email signup */}
        <EmailSignup />
      </div>
    </section>
  );
}
