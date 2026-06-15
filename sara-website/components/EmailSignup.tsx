"use client";

import { useState } from "react";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("https://formspree.io/f/YOUR_FORMSPREE_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setStatus("done");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="text-brand-sand text-xs tracking-[0.2em] uppercase">
        Thank you — we will be in touch.
      </p>
    );
  }

  return (
    <div>
      <p className="text-brand-sand/70 text-xs tracking-[0.2em] uppercase mb-5">
        Be the first to know
      </p>
      <form onSubmit={handleSubmit} className="flex max-w-sm mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-4 py-3 bg-white/10 border border-brand-sand/40 text-brand-cream placeholder:text-brand-sand/40 text-sm focus:outline-none focus:border-brand-sand/80 transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-3 bg-brand-terracotta text-brand-cream text-xs tracking-[0.2em] uppercase hover:bg-brand-terracotta/90 transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          {status === "loading" ? "···" : "Notify Me"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-3 text-brand-sand/60 text-xs">Something went wrong — please try again.</p>
      )}
    </div>
  );
}
