import React from 'react';
import { useNavigation, Link } from '../context/NavigationContext';
import { RESTAURANT_INFO, PHOTO_ASSETS } from '../data/restaurantData';
import { Award, Flame, UtensilsCrossed, Clock, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';

export function StoryPage() {
  return (
    <div className="flex flex-col gap-12 sm:gap-16 lg:gap-24 animate-in fade-in duration-300">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-surface-container border border-surface-container-high/80 p-6 sm:p-12 lg:p-16 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-transparent z-10 pointer-events-none" />
        
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity">
          <img
            src={PHOTO_ASSETS.streetAwning}
            alt="Kok Sen Keong Saik Shophouse Awning"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        </div>

        <div className="relative z-20 max-w-3xl flex flex-col gap-4 sm:gap-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-secondary">
            <span className="px-3 py-1 rounded-full bg-surface-container-highest/90 border border-secondary/30 backdrop-blur-md">
              Est. 1968 · Chinatown, Singapore
            </span>
            <span className="text-tertiary">·</span>
            <span className="text-tertiary">Three Generations of Wok Masters</span>
          </div>

          <h1 className="font-display-hero text-3xl sm:text-5xl lg:text-6xl text-on-surface font-extrabold tracking-tight leading-[1.1]">
            Fifty-Six Years of <br />
            <span className="text-secondary italic font-normal">Roaring Wok Hei</span> &amp; Heritage.
          </h1>

          <p className="font-body-lg text-sm sm:text-base md:text-lg text-tertiary leading-relaxed">
            From our beginnings as 國成球记菜社 to today’s renowned 國成餐室 at 4 Keong Saik Road, Kok Sen has remained an unwavering beacon of authentic Cantonese Zi Char in Singapore.
          </p>
        </div>
      </section>

      {/* 2. The Heritage Milestones */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 flex flex-col gap-4 sticky top-24">
          <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-widest">
            <Award className="w-4 h-4 text-primary" />
            <span>Verified Timeline</span>
          </div>
          <h2 className="font-headline-xl text-2xl sm:text-4xl text-on-surface font-extrabold leading-tight">
            Preserving Traditions, One Seasoned Wok at a Time.
          </h2>
          <p className="text-sm text-tertiary leading-relaxed">
            While menus and neighborhoods have transformed across decades, our kitchen’s philosophy has remained strictly consistent: high-heat wok breath, fresh seafood, and time-intensive stocks simmered before dawn.
          </p>

          <div className="p-4 rounded-xl bg-surface-container border border-secondary/30 mt-2">
            <div className="flex items-center gap-2 text-secondary font-bold text-sm">
              <Award className="w-4 h-4" />
              <span>Michelin Guide Singapore</span>
            </div>
            <p className="text-xs text-tertiary mt-1">
              Awarded the prestigious Michelin Bib Gourmand continuously from 2016 to 2026, recognizing our commitment to exceptional dining at sensible prices.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6 border-l border-surface-container-high/60 pl-6 sm:pl-8">
          {/* Milestone 1 */}
          <div className="flex flex-col gap-2 relative">
            <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-secondary border-4 border-surface" />
            <span className="font-mono text-xs font-bold text-secondary">1968</span>
            <h3 className="font-headline-md text-xl font-bold text-on-surface">
              Founding as 國成球记菜社
            </h3>
            <p className="text-xs sm:text-sm text-tertiary leading-relaxed">
              Founded by the Wong patriarch in Chinatown, Singapore, serving Cantonese workers, traders, and local families. The original repertoire focused on charcoal-fired claypots, braised offal, and wok-fried noodles.
            </p>
          </div>

          {/* Milestone 2 */}
          <div className="flex flex-col gap-2 relative">
            <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-surface" />
            <span className="font-mono text-xs font-bold text-secondary">1980s – 1990s</span>
            <h3 className="font-headline-md text-xl font-bold text-on-surface">
              The Evolution of Signature Recipes
            </h3>
            <p className="text-xs sm:text-sm text-tertiary leading-relaxed">
              Second-generation masters refined Kok Sen’s now-iconic recipes: roasting split king prawns to create the signature reddish-orange hor fun stock, and formulating the hand-pounded squid and prawn paste for Claypot Yong Tau Foo.
            </p>
          </div>

          {/* Milestone 3 */}
          <div className="flex flex-col gap-2 relative">
            <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-secondary border-4 border-surface" />
            <span className="font-mono text-xs font-bold text-secondary">2016 – 2026</span>
            <h3 className="font-headline-md text-xl font-bold text-on-surface">
              Michelin Bib Gourmand Recognition
            </h3>
            <p className="text-xs sm:text-sm text-tertiary leading-relaxed">
              Kok Sen was selected in the inaugural Singapore Michelin Guide Bib Gourmand list in 2016 and has maintained this high honour continuously from 2016 through 2026, drawing diners from across the globe while retaining our neighbourhood regulars.
            </p>
          </div>

          {/* Milestone 4 */}
          <div className="flex flex-col gap-2 relative">
            <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-surface" />
            <span className="font-mono text-xs font-bold text-secondary">Present Day</span>
            <h3 className="font-headline-md text-xl font-bold text-on-surface">
              Flagship at 4 Keong Saik &amp; City Square Mall
            </h3>
            <p className="text-xs sm:text-sm text-tertiary leading-relaxed">
              Now steered by the third generation, Kok Sen welcomes diners at our flagship shophouse at 4 Keong Saik Road and our modern, accessible outlet at City Square Mall. Both kitchens share identical ingredients and master chefs.
            </p>
          </div>
        </div>
      </section>

      {/* 3. The Three Pillars of Culinary Craft */}
      <section className="rounded-2xl sm:rounded-3xl bg-surface-container-low border border-surface-container-high/80 p-6 sm:p-10 lg:p-12 flex flex-col gap-8">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary">
            Kitchen Philosophy
          </span>
          <h2 className="font-headline-xl text-2xl sm:text-4xl text-on-surface font-extrabold">
            The Three Pillars of Kok Sen
          </h2>
          <p className="text-xs sm:text-sm text-tertiary leading-relaxed">
            No shortcuts, no artificial enhancers. Pure culinary dedication passed across generations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-surface-container border border-surface-container-high/60 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-headline-md text-lg font-bold text-on-surface">
                1. The Roaring 500°C Wok Hei
              </h3>
              <p className="text-xs sm:text-sm text-tertiary leading-relaxed mt-2">
                &ldquo;Wok Hei&rdquo; translates to the breath of the wok. Our chefs toss fresh flat rice noodles over intense, roaring blue flames, achieving deep charring without scorching, infusing every noodle with unmistakable smokiness.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-surface-container border border-surface-container-high/60 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center font-bold">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-headline-md text-lg font-bold text-on-surface">
                2. The 3-Hour Prawn Bisque
              </h3>
              <p className="text-xs sm:text-sm text-tertiary leading-relaxed mt-2">
                Our signature Big Prawn Hor Fun broth is not a light soup. It is brewed for hours from kilograms of fresh king prawn heads, shells, and aromatics until it achieves a deep reddish-orange viscosity and intense oceanic sweetness.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-surface-container border border-surface-container-high/60 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-headline-md text-lg font-bold text-on-surface">
                3. Hand-Stuffed Claypot Artistry
              </h3>
              <p className="text-xs sm:text-sm text-tertiary leading-relaxed mt-2">
                Our Claypot Yong Tau Foo does not use commercial pre-made pastes. Every morning, bean curd puffs, charred eggplants, and fresh chillies are hand-stuffed with 100% pure fish and squid paste before bubbling in dark savoury glaze.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Photo Archive Spotlight */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="rounded-2xl overflow-hidden border border-surface-container-high shadow-xl aspect-16/10">
          <img
            src={PHOTO_ASSETS.neonSigns}
            alt="Kok Sen Neon Signs and Interior"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col gap-4 p-2 sm:p-6">
          <span className="text-xs font-bold text-secondary uppercase tracking-widest">
            Atmosphere &amp; Culture
          </span>
          <h2 className="font-headline-xl text-2xl sm:text-3xl font-extrabold text-on-surface">
            Dining in a Chinatown Shophouse
          </h2>
          <p className="text-xs sm:text-sm text-tertiary leading-relaxed">
            Step through the arched doorway of 4 Keong Saik Road and experience the lively hum of conversation, the clatter of porcelain spoons against bowls, and the unmistakable aroma of garlic and chili searing over high heat.
          </p>
          <div className="pt-2">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-highest text-on-surface border border-surface-container-high text-xs font-semibold transition-all"
            >
              <span>View Archival Gallery</span>
              <ChevronRight className="w-4 h-4 text-secondary" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Navigation CTA */}
      <section className="rounded-2xl sm:rounded-3xl bg-surface-container border border-surface-container-high/80 p-8 sm:p-12 text-center flex flex-col items-center gap-4">
        <h2 className="font-headline-xl text-2xl sm:text-3xl font-extrabold text-on-surface">
          Experience Kok Sen in Person
        </h2>
        <p className="text-xs sm:text-sm text-tertiary max-w-md">
          Explore our complete menu of 125 menu listings across 14 categories or reserve a table at Keong Saik or City Square Mall.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/menu"
            className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105"
          >
            Explore Complete Menu
          </Link>
          <Link
            href="/reservations"
            className="px-6 py-3 rounded-xl bg-secondary hover:bg-secondary-fixed text-on-secondary font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105"
          >
            Reserve Table via WhatsApp
          </Link>
        </div>
      </section>
    </div>
  );
}
