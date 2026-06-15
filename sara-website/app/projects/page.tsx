import ProjectGrid from "@/components/ProjectGrid";

export const metadata = {
  title: "Projects | Althouse Design",
};

export default function ProjectsPage() {
  return (
    <div className="pt-16">
      {/* Under construction banner */}
      <div className="bg-brand-terracotta/10 border-b border-brand-terracotta/20 px-6 py-3 text-center">
        <p className="text-xs tracking-[0.2em] text-brand-terracotta uppercase">
          Our portfolio is coming soon — check back shortly.
        </p>
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="font-display text-3xl md:text-5xl tracking-[0.1em] text-brand-slate mb-4">
          Projects
        </h1>
        <p className="text-xs tracking-[0.2em] text-brand-sage uppercase">
          Atlanta &mdash; Georgia
        </p>
      </div>

      {/* Project grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <ProjectGrid />
      </div>
    </div>
  );
}
