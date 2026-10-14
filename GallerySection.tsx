import { useState } from 'react';
import { GALLERY_IMAGES } from '../data/restaurantData';
import { GalleryPhotoItem } from '../types';
import { ChevronLeft, ChevronRight, X, Maximize2, Award, Star, Camera } from 'lucide-react';

type FilterCategory = 'all' | 'space' | 'dishes' | 'wok' | 'claypot' | 'diner';

interface GallerySectionProps {
  customPhotos?: GalleryPhotoItem[];
}

export function GallerySection({ customPhotos = [] }: GallerySectionProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Combine custom user uploads with authentic archival photos
  const allImages: GalleryPhotoItem[] = [...customPhotos, ...GALLERY_IMAGES];

  const filteredImages = allImages.filter((img) => {
    if (activeFilter === 'all') return true;
    return img.category === activeFilter;
  });

  const dinerCount = allImages.filter(img => img.category === 'diner' || img.isClientPhoto).length;

  const selectedPhoto = selectedPhotoIndex !== null ? allImages[selectedPhotoIndex] : null;

  const handlePrev = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + allImages.length) % allImages.length);
  };

  const handleNext = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % allImages.length);
  };

  return (
    <section id="gallery" className="mt-8 sm:mt-space-3xl w-full max-w-full min-w-0 overflow-hidden flex flex-col gap-4 sm:gap-space-lg">
      <div className="w-full max-w-full min-w-0 flex flex-col lg:flex-row lg:items-end justify-between gap-3 sm:gap-space-md border-b border-surface-container-high/60 pb-3 sm:pb-space-md">
        <div className="flex flex-col gap-1 sm:gap-space-xs min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-subheading-script text-xs sm:text-subheading-script text-secondary italic">
              Authentic Archive &amp; Diner Snaps
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Award className="w-3 h-3" />
              {allImages.length} Curated Moments
            </span>
          </div>
          <h2 className="font-headline-xl text-2xl sm:text-3xl md:text-headline-xl text-on-surface mt-0.5">
            Evenings at 4 Keong Saik Road &amp; City Square Mall
          </h2>
          <p className="font-body-md text-xs sm:text-body-md text-tertiary max-w-2xl leading-relaxed">
            From the bustling illuminated shophouse façade and air-conditioned dining room to sizzling claypots, charred hor fun, and archival photography.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-surface-container rounded-lg border border-surface-container-high/60 overflow-x-auto no-scrollbar touch-scroll shrink-0">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`shrink-0 px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-tertiary hover:text-on-surface hover:bg-surface-container-high/40'
              }`}
            >
              All ({allImages.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('space')}
              className={`shrink-0 px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === 'space'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-tertiary hover:text-on-surface hover:bg-surface-container-high/40'
              }`}
            >
              Shophouse
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('dishes')}
              className={`shrink-0 px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === 'dishes'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-tertiary hover:text-on-surface hover:bg-surface-container-high/40'
              }`}
            >
              Signatures
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('wok')}
              className={`shrink-0 px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === 'wok'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-tertiary hover:text-on-surface hover:bg-surface-container-high/40'
              }`}
            >
              Wok Hei
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('claypot')}
              className={`shrink-0 px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === 'claypot'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-tertiary hover:text-on-surface hover:bg-surface-container-high/40'
              }`}
            >
              Claypot
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('diner')}
              className={`shrink-0 px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                activeFilter === 'diner'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30'
              }`}
            >
              <Camera className="w-3 h-3" />
              <span>Diner Snaps ({dinerCount})</span>
            </button>
          </div>
        </div>

        {/* Bento Grid */}
      <div className="w-full max-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
        {filteredImages.map((image, index) => {
          const globalIndex = allImages.findIndex((item) => item.id === image.id);
          const isWide = image.aspect === 'wide' && (index === 0 || index % 5 === 0);

          return (
            <div
              key={image.id}
              onClick={() => setSelectedPhotoIndex(globalIndex)}
              className={`group cursor-pointer rounded-xl overflow-hidden relative bg-surface-container border border-surface-container-high/60 shadow-md hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col ${
                isWide ? 'sm:col-span-2' : ''
              }`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-surface-container-lowest/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                {/* Badge Tag */}
                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${
                    image.isClientPhoto 
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' 
                      : 'bg-surface-container-lowest/90 text-primary border-surface-container-high'
                  }`}>
                    {image.tag}
                  </span>

                  {image.rating && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/90 text-black flex items-center gap-0.5 shadow-sm">
                      <Star className="w-2.5 h-2.5 fill-black" />
                      {image.rating}
                    </span>
                  )}
                </div>

                {/* Zoom Icon Button */}
                <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 opacity-70 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-on-surface flex items-center justify-center shadow-md">
                    <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </span>
                </div>

                {/* Title & Caption preview over gradient */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-space-md flex flex-col gap-0.5 sm:gap-1">
                  <h3 className="font-dish-title text-sm sm:text-base text-on-surface font-bold leading-snug group-hover:text-primary transition-colors">
                    {image.title}
                  </h3>
                  
                  {image.uploadedBy && (
                    <span className="text-[11px] text-emerald-400 font-medium">
                      By {image.uploadedBy}
                    </span>
                  )}

                  <p className="font-body-sm text-xs text-tertiary line-clamp-1 sm:line-clamp-2 leading-relaxed">
                    {image.caption}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-surface-container-lowest rounded-xl sm:rounded-2xl overflow-hidden border border-surface-container-high/80 shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b border-surface-container-high/50 bg-surface-container/60">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <span className={`px-2 py-0.5 rounded text-[11px] sm:text-xs font-bold uppercase tracking-wider border ${
                  selectedPhoto.isClientPhoto 
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' 
                    : 'bg-primary/20 text-primary border-primary/30'
                }`}>
                  {selectedPhoto.tag}
                </span>

                {selectedPhoto.uploadedBy && (
                  <span className="text-xs text-emerald-400 font-medium">
                    Uploaded by {selectedPhoto.uploadedBy} {selectedPhoto.date ? `· ${selectedPhoto.date}` : ''}
                  </span>
                )}

                <span className="text-xs text-tertiary">
                  {selectedPhotoIndex !== null ? selectedPhotoIndex + 1 : 1} of {allImages.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPhotoIndex(null)}
                className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Viewport */}
            <div className="relative w-full flex-1 min-h-[240px] sm:min-h-[420px] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[55vh] sm:max-h-[65vh] w-auto max-w-full object-contain mx-auto"
              />

              {/* Prev / Next controls */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-on-surface hover:bg-primary hover:text-on-primary flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-on-surface hover:bg-primary hover:text-on-primary flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Footer with details */}
            <div className="p-4 sm:p-5 bg-surface-container-lowest flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-t border-surface-container-high/40">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-dish-title text-base sm:text-lg text-on-surface font-bold">
                    {selectedPhoto.title}
                  </h3>
                  {selectedPhoto.rating && (
                    <div className="flex items-center text-amber-400">
                      {[...Array(selectedPhoto.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  )}
                </div>
                <p className="font-body-md text-xs sm:text-sm text-tertiary mt-0.5 sm:mt-1 max-w-2xl leading-relaxed">
                  {selectedPhoto.caption}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">

                <a
                  href="#book-table"
                  onClick={() => setSelectedPhotoIndex(null)}
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold text-xs tracking-wide hover:brightness-110 shadow-sm transition-all text-center"
                >
                  Reserve a Table
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
