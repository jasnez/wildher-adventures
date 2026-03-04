import React from 'react';
import Image from 'next/image';

/**
 * Hero sekcija na stranici Ture — pozadinska slika + naslov i kratki intro.
 */
export function ToursHero({ heroImageSrc, heroAlt, heroTitle, heroSubtitle }) {
  return (
    <section className="relative min-h-[50vh] flex flex-col justify-end">
      <Image
        src={heroImageSrc}
        alt={heroAlt}
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-16 pt-32 text-center md:pb-20 md:pt-40">
        <h1 className="text-hero font-bold text-white mb-4">{heroTitle}</h1>
        <p className="text-body-lg text-white/95 max-w-2xl mx-auto">
          {heroSubtitle}
        </p>
      </div>
    </section>
  );
}

export default ToursHero;
