import React from 'react';
import OptimizedImage from '@/components/OptimizedImage';

export function VisualItinerary({ steps }) {
  return (
    <section className="py-12 md:py-16 px-4 bg-neutral-50">
      <div className="mx-auto max-w-6xl">
        <div className="flex overflow-x-auto gap-6 pb-4 md:gap-8 md:overflow-visible md:flex-wrap">
          {steps.map(({ label, image }, idx) => (
            <div key={idx} className="flex-shrink-0 w-48 md:w-56">
              <div className="aspect-[4/3] rounded-lg overflow-hidden mb-2">
                <OptimizedImage
                  name={image}
                  alt=""
                  sizes="224px"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-small font-medium text-wildher-text">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
