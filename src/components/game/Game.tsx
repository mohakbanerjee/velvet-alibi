"use client";

import { useEffect, useReducer, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { gameReducer, initialState } from "@/game/reducer";
import { clearSave, loadSave, saveState } from "@/game/storage";
import { TitleScreen } from "./TitleScreen";
import { Investigation } from "./Investigation";
import { AccusationScreen } from "./AccusationScreen";
import { EndingScreen } from "./EndingScreen";
import { SiteFooter } from "./SiteFooter";

export function Game() {
  const router = useRouter();
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [ready, setReady] = useState(false);

  // Load the save once on mount. Nothing game specific renders until this runs (no hydration mismatch).
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("fresh") === "1") {
      // Fresh start: wipe progress, show the title, then drop the query so reloads keep progress.
      clearSave();
      dispatch({ type: "RESTART" });
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync with localStorage on mount
      setReady(true);
      router.replace("/");
      return;
    }
    const saved = loadSave();
    if (saved) dispatch({ type: "HYDRATE", state: saved });
    setReady(true);
    // router.replace is only used for ?fresh=1. Do not re-run when the router identity changes,
    // or a later navigation would reload the save over the game in progress.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save on every change, but only after the load above has finished.
  useEffect(() => {
    if (ready) saveState(state);
  }, [state, ready]);

  let screen: ReactNode = null;
  if (ready) {
    switch (state.phase) {
      case "title":
        screen = <TitleScreen onStart={() => dispatch({ type: "START" })} />;
        break;
      case "investigating":
        screen = <Investigation state={state} dispatch={dispatch} />;
        break;
      case "accusing":
        screen = <AccusationScreen dispatch={dispatch} />;
        break;
      case "ended":
        screen = <EndingScreen state={state} dispatch={dispatch} />;
        break;
    }
  }

  return (
    <div className="relative flex min-h-screen flex-1 flex-col overflow-x-hidden">
      <div aria-hidden="true" className="rain pointer-events-none fixed inset-0 z-0 overflow-hidden" />
      <div aria-hidden="true" className="vignette pointer-events-none fixed inset-0 z-0" />
      <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-0" />
      <main className="relative z-10 flex flex-1 flex-col">{screen}</main>
      <SiteFooter />
    </div>
  );
}
