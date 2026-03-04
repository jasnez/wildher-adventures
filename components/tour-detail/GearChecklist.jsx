import React from 'react';

const EMOJI = {
  gearBoots: '🥾',
  gearBackpack: '🎒',
  gearWater: '💧',
  gearCap: '🧢',
  gearJacket: '🧥',
  gearSleeping: '🛏️',
};

export function GearChecklist({ title, items }) {
  return (
    <section className="py-12 md:py-16 px-4 bg-neutral-50">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-wildher-text mb-8">{title}</h2>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {items.map(({ key, label }, i) => (
            <li key={i} className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm">
              <span className="text-xl" aria-hidden>{EMOJI[key] ?? '•'}</span>
              <span className="text-wildher-text">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
