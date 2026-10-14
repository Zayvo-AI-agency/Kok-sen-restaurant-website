import { useState, useEffect, useMemo } from 'react';
import { MenuItem } from '../types';
import { resolveDishPhoto } from '../utils/dishPhotoResolver';

interface DishDetailModalProps {
  dish: MenuItem | null;
  onClose: () => void;
  onAddToOrder: (dish: MenuItem, quantity: number, size?: string, unitPrice?: number) => void;
}

export function DishDetailModal({ dish, onClose, onAddToOrder }: DishDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('S');
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setActivePhotoIndex(0);
    setImageError(false);
    if (dish?.sizes) {
      if (dish.sizes.small !== undefined) setSelectedSize('S');
      else if (dish.sizes.half !== undefined) setSelectedSize('Half');
      else if (dish.sizes.whole !== undefined) setSelectedSize('Whole');
      else if (dish.sizes.medium !== undefined) setSelectedSize('M');
      else if (dish.sizes.large !== undefined) setSelectedSize('L');
      else setSelectedSize('S');
    } else {
      setSelectedSize('S');
    }
  }, [dish]);

  const photoRes = useMemo(() => {
    return dish ? resolveDishPhoto(dish) : null;
  }, [dish]);

  // Deduplicate identical photos within dish gallery while preserving supplied order
  const availablePhotos = useMemo(() => {
    if (!dish) return [];
    const candidates = [
      ...(dish.photos || []),
      photoRes?.imageUrl,
      dish.imageUrl,
      photoRes?.photo_source_url,
      dish.photo_source_url,
      dish.source_url
    ].filter(Boolean) as string[];
    return Array.from(new Set(candidates));
  }, [dish, photoRes]);

  if (!dish) return null;

  const isConflict = Boolean(
    dish.isConflict ||
    photoRes?.isConflict ||
    dish.photo_status === 'conflict_unresolved' ||
    dish.photo_status === 'official_image_conflict_requires_client_review'
  );

  const currentPhoto = availablePhotos[activePhotoIndex] || photoRes?.imageUrl || dish.imageUrl || photoRes?.photo_source_url || dish.photo_source_url;
  const hasValidPhoto = Boolean(currentPhoto && !imageError && !isConflict && photoRes?.hasOriginalPhoto !== false);

  // Determine effective unit price based on selected size or base price
  let currentUnitPrice = dish.price;
  if (dish.sizes) {
    if (selectedSize === 'S' && dish.sizes.small !== undefined) currentUnitPrice = dish.sizes.small;
    else if (selectedSize === 'M' && dish.sizes.medium !== undefined) currentUnitPrice = dish.sizes.medium;
    else if (selectedSize === 'L' && dish.sizes.large !== undefined) currentUnitPrice = dish.sizes.large;
    else if (selectedSize === 'Half' && dish.sizes.half !== undefined) currentUnitPrice = dish.sizes.half;
    else if (selectedSize === 'Whole' && dish.sizes.whole !== undefined) currentUnitPrice = dish.sizes.whole;
  }

  const handleAdd = () => {
    onAddToOrder(dish, quantity, dish.sizes ? selectedSize : undefined, currentUnitPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-surface-container-low border border-surface-container-high rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] sm:text-[20px]">close</span>
        </button>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          {/* Dish Image or Neutral Placeholder Header */}
          {hasValidPhoto ? (
            <div className="relative h-48 sm:h-60 md:h-64 w-full overflow-hidden bg-surface-container shrink-0">
              <img 
                src={currentPhoto} 
                alt={dish.nameEn} 
                className="w-full h-full object-cover transition-opacity duration-300"
                onError={(e) => {
                  const target = e.currentTarget;
                  const fallbackUrl = dish.photo_source_url || dish.source_url;
                  if (fallbackUrl && target.src !== fallbackUrl) {
                    target.src = fallbackUrl;
                  } else {
                    setImageError(true);
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent" />
              {dish.signatureNumber && (
                <span className="absolute bottom-3 left-3 sm:left-4 px-2.5 py-1 rounded bg-secondary text-on-secondary font-label-caps text-[11px] sm:text-label-caps uppercase font-bold shadow-md">
                  Signature {dish.signatureNumber} · Wok Hei
                </span>
              )}

              {/* Gallery Navigator for dishes with multiple photos */}
              {availablePhotos.length > 1 && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                  {availablePhotos.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePhotoIndex(idx);
                        setImageError(false);
                      }}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                        activePhotoIndex === idx
                          ? 'bg-secondary text-on-secondary'
                          : 'text-neutral-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      Photo {idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="relative h-32 sm:h-36 w-full bg-surface-container border-b border-surface-container-high/80 flex flex-col items-center justify-center p-4 text-center select-none shrink-0">
              <span className="font-mono text-xs font-bold text-secondary mb-1 px-2.5 py-0.5 rounded bg-surface-container-highest border border-surface-container-high">
                {dish.itemCode || dish.code}
              </span>
              <span className="font-dish-title text-base font-bold text-on-surface line-clamp-1">{dish.nameEn}</span>
              <span className="text-xs text-tertiary mt-0.5">{dish.nameZh}</span>
              <span className="text-[11px] text-tertiary/80 mt-1 font-medium">
                Photo unavailable
              </span>
            </div>
          )}

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {dish.itemCode && (
                <span className="font-mono text-sm font-bold px-2 py-0.5 rounded bg-surface-container-high text-secondary border border-surface-container-highest">
                  {dish.itemCode}
                </span>
              )}
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                {dish.nameEn}
              </h3>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-secondary font-headline-md text-base">
                {dish.nameZh}
              </span>
              {dish.isChefRecommendation && (
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">star</span>
                  Chef Recommendation
                </span>
              )}
              {dish.spicyLevel && dish.spicyLevel > 0 && (
                <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded text-xs font-bold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[13px]">local_fire_department</span>
                  {'🌶️'.repeat(dish.spicyLevel)}
                </span>
              )}
            </div>
          </div>

          <p className="font-body-md text-body-md text-tertiary leading-relaxed">
            {dish.description}
          </p>

          {dish.orderingNotes && dish.orderingNotes.length > 0 && (
            <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/25 text-xs text-secondary space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">info</span>
                <span>Online Ordering Conditions</span>
              </div>
              {dish.orderingNotes.map((note, idx) => (
                <div key={idx} className="leading-relaxed pl-1">• {note}</div>
              ))}
            </div>
          )}


          {/* Portion Size Selector if multi-size */}
          {dish.sizes && (
            <div className="pt-1">
              <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                Available Portion Sizes:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {dish.sizes.small !== undefined && (
                  <button
                    type="button"
                    onClick={() => setSelectedSize('S')}
                    className={`py-2 px-3 rounded-lg border text-sm font-semibold transition-all ${
                      selectedSize === 'S'
                        ? 'border-primary bg-primary/20 text-on-surface ring-1 ring-primary'
                        : 'border-surface-container-high bg-surface-container text-tertiary hover:text-on-surface'
                    }`}
                  >
                    <div className="font-bold">Small (S)</div>
                  </button>
                )}

                {dish.sizes.medium !== undefined && (
                  <button
                    type="button"
                    onClick={() => setSelectedSize('M')}
                    className={`py-2 px-3 rounded-lg border text-sm font-semibold transition-all ${
                      selectedSize === 'M'
                        ? 'border-primary bg-primary/20 text-on-surface ring-1 ring-primary'
                        : 'border-surface-container-high bg-surface-container text-tertiary hover:text-on-surface'
                    }`}
                  >
                    <div className="font-bold">Medium (M)</div>
                  </button>
                )}

                {dish.sizes.large !== undefined && (
                  <button
                    type="button"
                    onClick={() => setSelectedSize('L')}
                    className={`py-2 px-3 rounded-lg border text-sm font-semibold transition-all ${
                      selectedSize === 'L'
                        ? 'border-primary bg-primary/20 text-on-surface ring-1 ring-primary'
                        : 'border-surface-container-high bg-surface-container text-tertiary hover:text-on-surface'
                    }`}
                  >
                    <div className="font-bold">Large (L)</div>
                  </button>
                )}

                {dish.sizes.half !== undefined && (
                  <button
                    type="button"
                    onClick={() => setSelectedSize('Half')}
                    className={`py-2 px-3 rounded-lg border text-sm font-semibold transition-all ${
                      selectedSize === 'Half'
                        ? 'border-primary bg-primary/20 text-on-surface ring-1 ring-primary'
                        : 'border-surface-container-high bg-surface-container text-tertiary hover:text-on-surface'
                    }`}
                  >
                    <div className="font-bold">Half (半只)</div>
                  </button>
                )}

                {dish.sizes.whole !== undefined && (
                  <button
                    type="button"
                    onClick={() => setSelectedSize('Whole')}
                    className={`py-2 px-3 rounded-lg border text-sm font-semibold transition-all ${
                      selectedSize === 'Whole'
                        ? 'border-primary bg-primary/20 text-on-surface ring-1 ring-primary'
                        : 'border-surface-container-high bg-surface-container text-tertiary hover:text-on-surface'
                    }`}
                  >
                    <div className="font-bold">Whole (一只)</div>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Details & Tags */}
          <div className="space-y-2 pt-2 border-t border-surface-container-high/60">
            {dish.portionSize && (
              <div className="flex items-center gap-2 text-body-sm text-tertiary">
                <span className="material-symbols-outlined text-[18px] text-secondary">group</span>
                <span>Portion Recommendation: <strong className="text-on-surface">{dish.portionSize}</strong></span>
              </div>
            )}

            {dish.allergens && dish.allergens.length > 0 && (
              <div className="flex items-center gap-2 text-body-sm text-tertiary">
                <span className="material-symbols-outlined text-[18px] text-primary">info</span>
                <span>Contains: {dish.allergens.join(', ')}</span>
              </div>
            )}

            {dish.isVegetarianAvailable && (
              <div className="flex items-center gap-2 text-body-sm text-emerald-400">
                <span className="material-symbols-outlined text-[18px]">eco</span>
                <span>Vegetarian adjustment available on request</span>
              </div>
            )}


          </div>

          </div>
        </div>

        {/* Sticky Bottom Action Row */}
        <div className="shrink-0 p-3 sm:p-4 bg-surface-container border-t border-surface-container-high/80 flex items-center justify-between gap-2.5 sm:gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface flex items-center justify-center font-bold text-base sm:text-lg cursor-pointer"
            >
              -
            </button>
            <span className="w-6 sm:w-8 text-center font-price-tag text-on-surface font-bold text-sm sm:text-base">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface flex items-center justify-center font-bold text-base sm:text-lg cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Add Button */}
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg bg-secondary hover:bg-secondary-fixed text-on-secondary font-button-text text-xs sm:text-button-text uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg transition-colors cursor-pointer font-bold active:scale-98"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">add_shopping_cart</span>
            <span className="truncate">Add to Table Spread</span>
          </button>
        </div>
      </div>
    </div>
  );
}
