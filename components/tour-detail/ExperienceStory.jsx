import React from 'react';
import OptimizedImage from '@/components/OptimizedImage';
import { Link } from '@/i18n/navigation';

export function ExperienceStory({ title, storyText, imageName, ctaLabel, ctaHref }) {
  return (
    <section className="py-12 md:py-16 px-4">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-wildher-text mb-6">{title}</h2>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <p className="text-body text-wildher-text-muted whitespace-pre-line mb-6">{storyText}</p>
            {ctaHref && (
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center rounded-lg bg-brand-primary-green px-5 py-2.5 font-semibold text-white hover:bg-brand-primary-green/90 transition-colors"
              >
                {ctaLabel}
              </Link>
            )}
          </div>
          {imageName && (
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
              <OptimizedImage
                name={imageName}
                alt=""
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
