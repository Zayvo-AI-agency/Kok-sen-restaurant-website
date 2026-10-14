import { useState } from 'react';
import { FAQS } from '../data/restaurantData';

export function FaqSection() {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-3': true
  });

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="faqs" className="mt-8 sm:mt-space-3xl w-full max-w-full overflow-hidden flex flex-col gap-4 sm:gap-space-lg">
      <div className="flex flex-col gap-1 sm:gap-space-xs">
        <span className="font-subheading-script text-xs sm:text-subheading-script text-secondary italic">
          Good to know before you come
        </span>
        <h2 className="font-headline-xl text-2xl sm:text-3xl md:text-headline-xl text-on-surface mt-0.5">Frequently Asked Questions</h2>
      </div>

      <div className="flex flex-col gap-2.5 sm:gap-space-sm">
        {FAQS.map((faq) => {
          const isOpen = !!openIds[faq.id];

          return (
            <div 
              key={faq.id}
              className="rounded-xl overflow-hidden bg-surface-container border border-surface-container-high/60 shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                className="w-full p-3.5 sm:p-space-md md:p-space-lg flex items-center justify-between gap-3 sm:gap-space-md text-left hover:bg-surface-container-high/50 transition-colors cursor-pointer"
              >
                <span className="font-dish-title text-sm sm:text-base md:text-dish-title text-on-surface font-semibold">
                  {faq.question}
                </span>
                <span className={`material-symbols-outlined text-secondary transition-transform duration-300 text-[20px] sm:text-[24px] shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {isOpen && (
                <div className="px-3.5 pb-3.5 sm:px-space-md sm:pb-space-md md:px-space-lg md:pb-space-lg pt-0 text-tertiary font-body-md text-xs sm:text-body-md leading-relaxed border-t border-surface-container-high/30">
                  <p className="pt-2">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
