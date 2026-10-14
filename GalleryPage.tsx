import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useApp } from '../context/AppContext';
import { GALLERY_IMAGES, FULL_MENU_ITEMS } from '../data/restaurantData';
import { GalleryPhotoItem } from '../types';
import { 
  Camera, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2, 
  Plus, 
  UtensilsCrossed, 
  ArrowDownCircle,
  Eye
} from 'lucide-react';

type FilterCategory = 'all' | 'space' | 'dishes' | 'wok' | 'claypot' | 'diner';

const CATEGORY_TABS: { id: FilterCategory; label: string; count?: number }[] = [
  { id: 'all', label: 'All Photos' },
  { id: 'dishes', label: 'Signature Dishes' },
  { id: 'space', label: 'Shophouse & Atmosphere' },
  { id: 'wok', label: 'Wok Hei' },
  { id: 'claypot', label: 'Claypot Craft' },
  { id: 'diner', label: 'Diner Moments' },
];

const BATCH_SIZE = 12;

export function GalleryPage() {
  const { navigate } = useNavigation();
  const { setSelectedDish, handleAddToOrder } = useApp();

  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(BATCH_SIZE);

  // Filtered list
  const filteredPhotos = GALLERY_IMAGES.filter((img) => {
    if (activeFilter === 'all') return true;
    return img.category === activeFilter;
  });

  // Current batch for performance (avoid downloading everything at once)
  const currentBatch = filteredPhotos.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPhotos.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + BATCH_SIZE);
  };

  // Reset pagination on filter change
  const handleFilterChange = (cat: FilterCategory) => {
    setActiveFilter(cat);
    setVisibleCount(BATCH_SIZE);
  };

  // Lightbox selection
  const selectedPhoto = selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null;

  const handlePrev = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
  }, [selectedPhotoIndex, filteredPhotos.length]);

  const handleNext = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % filteredPhotos.length);
  }, [selectedPhotoIndex, filteredPhotos.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedPhotoIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhotoIndex(null);
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, handlePrev, handleNext]);

  // Match photo to menu dish if applicable
  const matchedDish = selectedPhoto ? FULL_MENU_ITEMS.find((d) => {
    const title = selectedPhoto.title.toLowerCase();
    const nameEn = d.nameEn.toLowerCase();
    const dishCode = d.itemCode || d.code;
    return title.includes(nameEn) || nameEn.includes(title) || (dishCode ? title.includes(dishCode.toLowerCase()) : false);
  }) : null;

  return (
    <div className="flex flex-col gap-8 sm:gap-12 animate-in fade-in duration-300">
      {/* 1. Page Header */}
      <section className="flex flex-col gap-3 border-b border-surface-container-high/60 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-secondary">
          <Camera className="w-4 h-4 text-primary" />
          <span className="uppercase tracking-widest font-label-caps">Visual Archive &amp; Food Gallery</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-on-surface font-extrabold tracking-tight">
              Evenings at Kok Sen <span className="font-normal italic text-secondary text-2xl sm:text-3xl ml-1 font-serif">图集</span>
            </h1>
            <p className="font-body-md text-xs sm:text-body-md text-tertiary max-w-2xl mt-1.5 leading-relaxed">
              Archival moments from 4 Keong Saik Road and City Square Mall: bustling shophouse facades, blazing wok flames, and authentic dishes prepared by our master chefs.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-tertiary">
            <span className="px-3 py-1.5 rounded-lg bg-surface-container border border-surface-container-high font-semibold text-secondary">
              {GALLERY_IMAGES.length} Verified Photographs
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-scroll pt-3">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleFilterChange(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-secondary text-on-secondary shadow-xs font-bold'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-white border border-surface-container-high/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {currentBatch.map((image, index) => {
          return (
            <div
              key={image.id}
              onClick={() => setSelectedPhotoIndex(index)}
              className="group relative flex flex-col rounded-2xl bg-surface-container border border-surface-container-high/80 overflow-hidden shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-xl"
            >
              {/* Photo */}
              <div className="relative aspect-4/3 overflow-hidden bg-surface-container-lowest">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Tag */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-[10px] font-bold text-secondary border border-secondary/30">
                  {image.tag}
                </div>

                {/* Zoom hover indicator */}
                <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-on-surface flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-60" />
              </div>

              {/* Title & Caption */}
              <div className="p-4 flex flex-col justify-between gap-2 flex-1">
                <div>
                  <h3 className="font-dish-title text-sm sm:text-base font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                    {image.title}
                  </h3>
                  <p className="text-xs text-tertiary line-clamp-2 mt-1 leading-relaxed">
                    {image.caption}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-surface-container-high/60 text-[11px] text-tertiary">
                  <span>Click to enlarge</span>
                  <span className="text-secondary font-semibold group-hover:underline flex items-center gap-0.5">
                    View <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Load More Button (Sensible batching) */}
      {hasMore && (
        <div className="flex flex-col items-center justify-center gap-2 pt-4">
          <button
            type="button"
            onClick={handleLoadMore}
            className="px-6 py-3 rounded-xl bg-surface-container hover:bg-surface-container-highest text-on-surface border border-surface-container-high font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all hover:scale-105 cursor-pointer shadow-md"
          >
            <ArrowDownCircle className="w-4 h-4 text-secondary" />
            <span>Load More Photos ({filteredPhotos.length - visibleCount} remaining)</span>
          </button>
          <span className="text-xs text-tertiary">
            Showing {visibleCount} of {filteredPhotos.length} verified photos
          </span>
        </div>
      )}

      {/* 4. Accessible Lightbox Modal */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-surface-container-lowest rounded-2xl overflow-hidden border border-surface-container-high shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 border-b border-surface-container-high/60 bg-surface-container/60">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-secondary/20 text-secondary border border-secondary/30">
                  {selectedPhoto.tag}
                </span>
                <span className="text-xs text-tertiary">
                  {selectedPhotoIndex !== null ? selectedPhotoIndex + 1 : 1} of {filteredPhotos.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPhotoIndex(null)}
                className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors cursor-pointer"
                aria-label="Close photo view"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Image with Navigation Arrows */}
            <div className="relative flex-1 bg-black/60 flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[420px] max-h-[60vh]">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-full max-w-full object-contain mx-auto"
              />

              {/* Prev / Next buttons */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-surface-container-lowest/80 hover:bg-surface-container text-on-surface flex items-center justify-center border border-surface-container-high shadow-lg transition-all cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-surface-container-lowest/80 hover:bg-surface-container text-on-surface flex items-center justify-center border border-surface-container-high shadow-lg transition-all cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Caption and Actions */}
            <div className="p-4 sm:p-5 bg-surface-container border-t border-surface-container-high/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col gap-1 min-w-0">
                <h3 className="font-dish-title text-base sm:text-lg font-bold text-on-surface truncate">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs text-tertiary leading-relaxed line-clamp-2">
                  {selectedPhoto.caption}
                </p>
              </div>

              {/* Action buttons if dish matched */}
              <div className="flex items-center gap-2 shrink-0">
                {matchedDish && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDish(matchedDish);
                        setSelectedPhotoIndex(null);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-surface-container-highest hover:bg-surface-bright text-on-surface text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-secondary" />
                      <span>View Dish Info</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleAddToOrder(matchedDish, 1);
                        setSelectedPhotoIndex(null);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Order (${matchedDish.price})</span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => {
                    navigate('/menu');
                    setSelectedPhotoIndex(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-surface-container-highest hover:bg-surface-bright text-on-surface text-xs font-semibold transition-colors"
                >
                  Explore Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
