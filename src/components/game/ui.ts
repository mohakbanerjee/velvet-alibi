const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brass";

export const btnPrimary = `inline-flex min-h-11 items-center justify-center rounded-sm border border-brass bg-brass px-6 py-3 font-display text-lg font-semibold text-noir transition-colors hover:bg-[#d9b23a] disabled:cursor-not-allowed disabled:border-steel disabled:bg-steel disabled:text-smoke ${focusRing}`;

export const btnBlood = `inline-flex min-h-11 items-center justify-center rounded-sm border border-blood bg-blood px-6 py-3 font-display text-lg font-semibold text-ash transition-colors hover:bg-[#a52626] disabled:cursor-not-allowed disabled:border-steel disabled:bg-steel/40 disabled:text-smoke ${focusRing}`;

export const btnGhost = `inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-steel px-4 py-2 font-typewriter text-sm text-ash transition-colors hover:border-smoke hover:bg-white/5 ${focusRing}`;
