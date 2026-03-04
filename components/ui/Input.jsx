'use client';

import React from 'react';

const inputBase =
  'w-full rounded-radius-button border border-neutral-300 bg-white px-4 py-2.5 text-body text-wildher-text placeholder:text-neutral-400 focus:border-brand-primary-green focus:outline-none focus:ring-2 focus:ring-brand-primary-green/20 transition-colors';

/**
 * Label — oznaka za form polje.
 */
export function Label({ children, htmlFor, required, className = '' }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-small font-medium text-wildher-text mb-1.5 ${className}`}
    >
      {children}
      {required && <span className="text-error ml-0.5" aria-hidden="true">*</span>}
    </label>
  );
}

/**
 * Input — tekstualno polje (text, email, tel, number).
 */
export function Input({
  id,
  label,
  required,
  error,
  className = '',
  type = 'text',
  ...props
}) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
      )}
      <input
        id={inputId}
        type={type}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`${inputBase} ${error ? 'border-error focus:ring-error/20 focus:border-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-small text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Textarea — višeredno polje.
 */
export function Textarea({
  id,
  label,
  required,
  error,
  className = '',
  rows = 4,
  ...props
}) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
      )}
      <textarea
        id={inputId}
        required={required}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`${inputBase} min-h-[100px] resize-y ${error ? 'border-error focus:ring-error/20 focus:border-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-small text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Select — padajući izbor.
 */
export function Select({
  id,
  label,
  required,
  error,
  options = [],
  placeholder,
  className = '',
  ...props
}) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
      )}
      <select
        id={inputId}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`${inputBase} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2378716c%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10 ${error ? 'border-error' : ''} ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) =>
          typeof opt === 'string' ? (
            <option key={opt} value={opt}>{opt}</option>
          ) : (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          )
        )}
      </select>
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-small text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Checkbox — jedan checkbox s labelom.
 */
export function Checkbox({ id, label, className = '', ...props }) {
  const inputId = id || props.name;
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <input
        id={inputId}
        type="checkbox"
        className="mt-1 h-5 w-5 rounded border-neutral-300 text-brand-primary-green focus:ring-brand-primary-green/20"
        {...props}
      />
      {label && (
        <Label htmlFor={inputId} className="mb-0">
          {label}
        </Label>
      )}
    </div>
  );
}

export default Input;
