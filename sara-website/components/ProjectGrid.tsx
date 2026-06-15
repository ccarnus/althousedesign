import Image from "next/image";
import { projectImages } from "@/lib/images";

export default function ProjectGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
      {projectImages.map((img, i) => (
        <div key={i} className="relative aspect-square group overflow-hidden">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-brand-cream/20 group-hover:bg-transparent transition-colors duration-500" />
          {/* Label */}
          <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-500">
            <span className="text-[10px] tracking-[0.3em] uppercase text-white bg-black/40 px-4 py-2">
              Coming Soon
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
