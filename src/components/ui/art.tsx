import Image from "next/image";

/**
 * Product / portrait artwork. Shows the uploaded image when there is one; otherwise a
 * generated, on-palette composition so the layout never looks empty.
 */
export function Art({ tone, label, className = "", src }: { tone: [string, string]; label: string; className?: string; src?: string | null }) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ background: tone[0] }}>
        <Image src={src} alt={label} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" unoptimized={src.startsWith("/uploads/")} />
      </div>
    );
  }
  return (
    <div role="img" aria-label={label} className={`relative overflow-hidden ${className}`} style={{ background: tone[0] }}>
      <span className="absolute -right-[18%] -top-[18%] h-[70%] w-[70%] rounded-full" style={{ background: tone[1] }} />
      <span className="absolute -bottom-[10%] -left-[10%] h-[48%] w-[48%] rotate-12 rounded-[28%] border-2 border-grey-900 bg-white/70" />
      <span className="absolute bottom-[18%] right-[16%] h-[18%] w-[18%] rounded-full border-2 border-grey-900 bg-gold" />
      <span className="absolute left-[14%] top-[14%] h-[10%] w-[34%] -rotate-6 rounded-full border-2 border-grey-900 bg-white/80" />
    </div>
  );
}
