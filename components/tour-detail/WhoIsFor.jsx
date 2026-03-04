import React from 'react';
import OptimizedImage from '@/components/OptimizedImage';

export function WhoIsFor({ title, included, excluded, imageName }) {
  return (
    <section className="py-12 md:py-16 px-4">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-wildher-text mb-8">{title}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <ul className="space-y-2">
              {included.map((text, i) => (
                <li key={i} className="flex items-start gap-2 text-wildher-text">
                  <span className="text-brand-primary-green mt-0.5" aria-hidden>✔</span>
                  <span>{text}</span>
                </li>
              ))}
              {excluded.map((text, i) => (
                <li key={`ex-${i}`} className="flex items-start gap-2 text-wildher-text-muted">
                  <span className="mt-0.5" aria-hidden>✘</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
          {imageName && (
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
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
