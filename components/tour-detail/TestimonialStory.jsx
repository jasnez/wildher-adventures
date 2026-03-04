import React from 'react';
import OptimizedImage from '@/components/OptimizedImage';

export function TestimonialStory({ quote, author, imageName }) {
  return (
    <section className="py-12 md:py-16 px-4 bg-neutral-50">
      <div className="mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {imageName && (
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden order-2 md:order-1">
              <OptimizedImage
                name={imageName}
                alt=""
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="order-1 md:order-2">
            <h3 className="font-display text-xl font-bold text-wildher-text mb-4">Nezaboravno iskustvo!</h3>
            <blockquote className="text-body text-wildher-text-muted mb-4">&ldquo;{quote}&rdquo;</blockquote>
            <cite className="not-italic text-small text-wildher-text-muted">{author}</cite>
          </div>
        </div>
      </div>
    </section>
  );
}
