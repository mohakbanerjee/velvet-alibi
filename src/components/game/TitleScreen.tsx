import { SUSPECTS } from "@/game/data";
import { btnPrimary } from "./ui";

export function TitleScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-10 px-6 py-12">
      <div className="space-y-6 text-center">
        <h1 className="font-display text-5xl font-bold tracking-wide text-ash sm:text-6xl">Velvet Alibi</h1>
        <p className="mx-auto max-w-prose text-lg leading-relaxed text-smoke">
          Port Halcyon, 1947. Rain on the windows of <strong className="font-semibold text-ash">The Velvet Lantern</strong>,
          a jazz club by the docks. At 11:40 PM the owner, <strong className="font-semibold text-ash">Victor Hale</strong>,
          is found dead at his desk, a glass of bourbon by his hand. The band kept playing for four more bars before anyone
          screamed. You are the detective called in at midnight. Four rooms, eight clues, four suspects, one killer. Find at
          least three clues, then make your accusation. You only get one.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="font-typewriter text-sm uppercase tracking-[0.25em] text-brass">The suspects</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {SUSPECTS.map((s) => (
            <li key={s.id} className="rounded-sm border border-steel bg-black/40 p-4">
              <p className="font-display text-xl text-ash">{s.name}</p>
              <p className="text-sm text-brass">{s.role}</p>
              <p className="mt-2 text-sm text-smoke">{s.motive}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center">
        <button type="button" data-testid="start-case-button" onClick={onStart} className={btnPrimary}>
          Take the Case
        </button>
      </div>
    </section>
  );
}
