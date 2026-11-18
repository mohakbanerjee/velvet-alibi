import type { Dispatch } from "react";
import { TOTAL_CLUES } from "@/game/data";
import { accuse } from "@/game/rules";
import type { GameAction } from "@/game/reducer";
import type { GameState } from "@/game/types";
import { btnPrimary } from "./ui";

export function EndingScreen({ state, dispatch }: { state: GameState; dispatch: Dispatch<GameAction> }) {
  const result = state.accusedId ? accuse(state, state.accusedId) : null;
  const lost = result?.id === "wrong";

  return (
    <section
      data-testid="ending-screen"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-6 py-12 text-center"
    >
      <p className="font-typewriter text-xs uppercase tracking-[0.25em] text-brass">The case is closed</p>
      <h1
        data-testid="ending-title"
        className={`font-display text-5xl font-bold ${lost ? "text-blood" : "text-brass"}`}
      >
        {result?.heading ?? "Case Closed"}
      </h1>
      {result && <p className="text-xl italic leading-relaxed text-ash">{result.subtitle}</p>}
      {result?.epilogue && (
        <p className="mx-auto max-w-prose text-base leading-relaxed text-smoke">{result.epilogue}</p>
      )}
      <p className="font-typewriter text-sm text-smoke">
        You found {state.notebook.length} of {TOTAL_CLUES} clues.
      </p>
      <div className="flex justify-center pt-4">
        <button type="button" data-testid="restart-button" onClick={() => dispatch({ type: "RESTART" })} className={btnPrimary}>
          Play Again
        </button>
      </div>
    </section>
  );
}
