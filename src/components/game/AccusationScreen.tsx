import { useState, type Dispatch } from "react";
import { SUSPECTS } from "@/game/data";
import type { GameAction } from "@/game/reducer";
import type { SuspectId } from "@/game/types";
import { btnBlood, btnGhost } from "./ui";

export function AccusationScreen({ dispatch }: { dispatch: Dispatch<GameAction> }) {
  const [selected, setSelected] = useState<SuspectId | null>(null);

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-10">
      <div className="space-y-2">
        <p className="font-typewriter text-xs uppercase tracking-[0.25em] text-blood">Final accusation</p>
        <h1 className="font-display text-4xl font-bold text-ash sm:text-5xl">Who killed Victor Hale?</h1>
        <p className="text-smoke">Choose carefully. You only get one.</p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {SUSPECTS.map((s) => {
          const picked = selected === s.id;
          return (
            <li key={s.id}>
              <button
                type="button"
                data-testid={`suspect-${s.id}`}
                aria-pressed={picked}
                onClick={() => setSelected(s.id)}
                className={`flex h-full w-full flex-col gap-1 rounded-sm border p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass ${
                  picked
                    ? "border-blood bg-blood/15 shadow-[0_0_0_1px_var(--color-blood)]"
                    : "border-steel bg-black/40 hover:border-smoke"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-display text-2xl text-ash">{s.name}</span>
                  {picked && <span className="font-typewriter text-xs uppercase tracking-widest text-blood">Selected</span>}
                </span>
                <span className="text-sm text-brass">{s.role}</span>
                <span className="mt-1 text-sm text-smoke">{s.motive}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          data-testid="cancel-accusation"
          onClick={() => dispatch({ type: "CANCEL_ACCUSATION" })}
          className={btnGhost}
        >
          Back to the case
        </button>
        <button
          type="button"
          data-testid="confirm-accusation"
          disabled={!selected}
          onClick={() => {
            if (selected) dispatch({ type: "ACCUSE", suspectId: selected });
          }}
          className={btnBlood}
        >
          Confirm Accusation
        </button>
      </div>
    </section>
  );
}
