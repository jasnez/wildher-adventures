'use client';

import React from 'react';

const variantStyles = {
  primary:
    'bg-brand-primary-green text-white shadow-button hover:bg-primary-700 focus-visible:ring-2 focus-visible:ring-brand-primary-green focus-visible:ring-offset-2',
  secondary:
    'bg-brand-earth-tone text-white shadow-button hover:bg-secondary-700 focus-visible:ring-2 focus-visible:ring-brand-earth-tone focus-visible:ring-offset-2',
  outline:
    'border-2 border-brand-primary-green text-brand-primary-green bg-transparent hover:bg-primary-50 focus-visible:ring-2 focus-visible:ring-brand-primary-green focus-visible:ring-offset-2',
  ghost:
    'text-brand-primary-green hover:bg-primary-50 focus-visible:ring-2 focus-visible:ring-brand-primary-green focus-visible:ring-offset-2',
  dark: 'bg-brand-charcoal text-brand-off-white shadow-button hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-brand-off-white focus-visible:ring-offset-2',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-small gap-1.5 min-h-[36px]',
  md: 'px-5 py-2.5 text-body gap-2 min-h-[44px]',
  lg: 'px-6 py-3 text-body-lg gap-2.5 min-h-[48px]',
};

/**
 * Button — dizajn sistem dugme.
 * @param {string} variant - primary | secondary | outline | ghost | dark
 * @param {string} size - sm | md | lg
 * @param {React.ReactNode} iconLeft - ikona lijevo od teksta
 * @param {React.ReactNode} iconRight - ikona desno od teksta
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  className = '',
  disabled = false,
  type = 'button',
  as: Component = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-radius-button transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none min-w-[44px]';
  const variantClass = variantStyles[variant] ?? variantStyles.primary;
  const sizeClass = sizeStyles[size] ?? sizeStyles.md;

  const content = (
    <>
      {iconLeft && <span className="shrink-0 [&>svg]:w-5 [&>svg]:h-5">{iconLeft}</span>}
      {children}
      {iconRight && <span className="shrink-0 [&>svg]:w-5 [&>svg]:h-5">{iconRight}</span>}
    </>
  );

  if (Component === 'a') {
    return (
      <a
        className={`${base} ${variantClass} ${sizeClass} ${className}`}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {content}
    </button>
  );
}

export default Button;
