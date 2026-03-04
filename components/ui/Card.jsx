'use client';

import React from 'react';

const baseCard =
  'rounded-radius-card bg-wildher-surface shadow-card overflow-hidden transition-shadow duration-200 hover:shadow-card-hover';

/**
 * Card — osnovna kartica (wrapper).
 */
export function Card({ children, className = '', as: Component = 'div', ...props }) {
  return (
    <Component className={`${baseCard} ${className}`} {...props}>
      {children}
    </Component>
  );
}

/**
 * CardImage — gornji dio kartice (slika).
 */
export function CardImage({ children, className = '' }) {
  return <div className={`aspect-[4/3] overflow-hidden bg-neutral-200 ${className}`}>{children}</div>;
}

/**
 * CardContent — sadržaj ispod slike (padding).
 */
export function CardContent({ children, className = '' }) {
  return <div className={`p-4 md:p-5 ${className}`}>{children}</div>;
}

/**
 * CardTour — kartica ture (slika + naslov + meta + opis + CTA).
 */
export function CardTour({
  image,
  title,
  meta,
  description,
  price,
  ctaLabel = 'Saznaj više',
  ctaHref,
  className = '',
}) {
  return (
    <Card className={className}>
      <CardImage>{image}</CardImage>
      <CardContent>
        {meta && <p className="text-small text-wildher-text-muted mb-1">{meta}</p>}
        <h3 className="text-h3 text-wildher-text mb-2">{title}</h3>
        {description && <p className="text-small text-wildher-text-muted line-clamp-2 mb-3">{description}</p>}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {price != null && (
            <span className="font-semibold text-brand-primary-green">
              od {price}€
            </span>
          )}
          {ctaHref && (
            <a
              href={ctaHref}
              className="text-small font-semibold text-brand-primary-green hover:underline"
            >
              {ctaLabel} →
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * CardFeature — kartica za "Zašto mi?" (ikona + naslov + tekst).
 */
export function CardFeature({ icon, title, children, className = '' }) {
  return (
    <Card className={`text-center ${className}`}>
      <CardContent>
        {icon && <div className="flex justify-center mb-3 text-brand-primary-green">{icon}</div>}
        <h3 className="text-h3 text-wildher-text mb-2">{title}</h3>
        <p className="text-body text-wildher-text-muted">{children}</p>
      </CardContent>
    </Card>
  );
}

/**
 * CardBlog — kartica blog posta (slika + naslov + excerpt + datum).
 */
export function CardBlog({ image, title, excerpt, date, href, className = '' }) {
  return (
    <Card className={className}>
      <CardImage>{image}</CardImage>
      <CardContent>
        {date && <p className="text-caption text-wildher-text-muted mb-1">{date}</p>}
        <h3 className="text-h3 text-wildher-text mb-2 line-clamp-2">{title}</h3>
        {excerpt && <p className="text-small text-wildher-text-muted line-clamp-2 mb-3">{excerpt}</p>}
        {href && (
          <a href={href} className="text-small font-semibold text-brand-primary-green hover:underline">
            Čitaj više →
          </a>
        )}
      </CardContent>
    </Card>
  );
}

export default Card;
