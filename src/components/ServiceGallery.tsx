import Image from 'next/image';

export type GalleryItem = {
  src: string;
  alt: string;
  caption?: string;
};

export type ServiceGalleryProps = {
  title?: string;
  intro?: string;
  items: GalleryItem[];
};

/**
 * Canonical sub-page gallery. 3-col at lg, 2-col at sm, 1-col at mobile.
 * Each tile: aspect-[4/3] bounded, rounded-sm, lazy-load (next/image default).
 * LB-CS-13 contained within container-wide (NOT edge-to-edge). gap-6 lg:gap-8.
 * LB-CS-15: items must be work-specific or work-portfolio-service kind.
 *   NEVER team-portrait, logo, or background-texture — caller's responsibility.
 * LB-CS-16: tile_3col named tier sizes.
 * Returns null if no items — caller renders nothing instead of empty section.
 */
export default function ServiceGallery({
  title = 'Finished work',
  intro,
  items,
}: ServiceGalleryProps) {
  if (!items || items.length === 0) return null;
  return (
    <section className="py-14 md:py-20 bg-cream">
      <div className="container-wide">
        <div className="mb-8 md:mb-10 max-w-[52ch]">
          <p className="uppercase tracking-widest text-xs text-bronze font-semibold mb-3">
            Portfolio
          </p>
          <h2 className="display text-2xl md:text-3xl mb-3">{title}</h2>
          {intro && (
            <p className="text-softgray leading-relaxed">{intro}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item, i) => (
            <figure
              key={i}
              className="group relative aspect-[4/3] overflow-hidden rounded-sm bg-charcoal/5 ring-1 ring-charcoal/10 shadow-sm"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              {item.caption && (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/85 via-charcoal/40 to-transparent p-4 text-sm text-cream">
                  {item.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
