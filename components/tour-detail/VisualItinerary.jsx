import React from 'react';
import OptimizedImage from '@/components/OptimizedImage';

/**
 * Vertical timeline rendering of itinerary steps.
 * Each step is: optional time chip (eyebrow) + label (h3) + optional
 * description + optional small thumbnail to the right on desktop /
 * stacked on mobile. Steps that have neither time nor description still
 * render as a clear timeline marker with their label.
 */
export function VisualItinerary({ steps }) {
  if (!Array.isArray(steps) || steps.length === 0) return null;

  return (
    <section className="py-12 md:py-16 px-4 bg-neutral-50">
      <div className="mx-auto max-w-3xl">
        <ol className="relative space-y-8 border-l border-neutral-300 pl-6 md:pl-8">
          {steps.map((step, idx) => (
            <li key={idx} className="relative">
              <span
                aria-hidden
                className="absolute -left-[1.95rem] md:-left-[2.45rem] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-primary-green ring-4 ring-neutral-50"
              />
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1 min-w-0">
                  {step.time && (
                    <p className="text-caption font-semibold uppercase tracking-wide text-brand-primary-green mb-1">
                      {step.time}
                    </p>
                  )}
                  <h3 className="text-h3 font-semibold text-wildher-text mb-1">
                    {step.label}
                  </h3>
                  {step.description && (
                    <p className="text-small text-wildher-text-muted">
                      {step.description}
                    </p>
                  )}
                </div>
                {step.image && (
                  <div className="flex-shrink-0 w-full md:w-32 aspect-[4/3] md:aspect-square rounded-lg overflow-hidden">
                    <OptimizedImage
                      name={step.image}
                      alt=""
                      sizes="(max-width: 768px) 100vw, 128px"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
