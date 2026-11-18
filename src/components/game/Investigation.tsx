import { useEffect, useRef, useState, type Dispatch } from "react";
import { ROOMS, TOTAL_CLUES, cluesInRoom, getClue, getRoom } from "@/game/data";
import { REQUIRED_CLUES, canAccuse } from "@/game/rules";
import type { GameAction } from "@/game/reducer";
import type { ClueId, GameState, RoomId } from "@/game/types";
import { useWideLayout } from "./useWideLayout";
import { btnBlood, btnGhost } from "./ui";

interface Props {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

export function Investigation({ state, dispatch }: Props) {
  const wide = useWideLayout();
  const [openClueId, setOpenClueId] = useState<ClueId | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const goTo = (room: RoomId) => dispatch({ type: "GO_TO_ROOM", room });

  const openClue = (clueId: ClueId) => {
    dispatch({ type: "EXAMINE_CLUE", clueId });
    setOpenClueId(clueId);
  };

  const scene = <RoomScene state={state} onOpenClue={openClue} />;
  const accuse = <AccuseBlock state={state} dispatch={dispatch} />;

  if (wide === null) return null;

  return (
    <>
      {wide ? (
        <div className="mx-auto grid w-full max-w-[90rem] flex-1 grid-cols-[13rem_minmax(0,1fr)_19rem] gap-6 p-6">
          <nav aria-label="Rooms" data-testid="room-nav" className="flex flex-col gap-2 pt-2">
            <RoomButtons current={state.currentRoom} onGo={goTo} />
          </nav>
          <div className="flex min-w-0 flex-col gap-6">{scene}</div>
          <aside className="flex flex-col gap-6">
            <NotebookPanel state={state} />
            {accuse}
          </aside>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-6 px-4 pb-36 pt-6">
          <div className="flex items-center justify-between gap-4">
            <p className="font-typewriter text-xs uppercase tracking-[0.2em] text-smoke">Case file open</p>
            <button
              type="button"
              data-testid="notebook-toggle"
              aria-expanded={sheetOpen}
              onClick={() => setSheetOpen(true)}
              className={btnGhost}
            >
              Notebook
              <span className="text-brass">
                {state.notebook.length}/{TOTAL_CLUES}
              </span>
            </button>
          </div>
          {scene}
          {accuse}
          <nav
            aria-label="Rooms"
            data-testid="room-nav"
            className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 gap-1 border-t border-steel bg-noir/95 p-2 backdrop-blur"
          >
            <RoomButtons current={state.currentRoom} onGo={goTo} compact />
          </nav>
          {sheetOpen && (
            <div className="sheet-up fixed inset-x-0 bottom-0 z-30 max-h-[75vh] overflow-y-auto rounded-t-sm border-t border-brass bg-noir p-4 shadow-2xl">
              <NotebookPanel state={state} onClose={() => setSheetOpen(false)} />
            </div>
          )}
        </div>
      )}
      <ClueDialog clueId={openClueId} onClose={() => setOpenClueId(null)} />
    </>
  );
}

function RoomButtons({
  current,
  onGo,
  compact = false,
}: {
  current: RoomId;
  onGo: (room: RoomId) => void;
  compact?: boolean;
}) {
  return (
    <>
      {ROOMS.map((room) => {
        const active = room.id === current;
        const tone = active
          ? "border-brass bg-brass/10 text-brass"
          : "border-steel text-smoke hover:border-smoke hover:text-ash";
        const size = compact
          ? "min-h-11 min-w-0 whitespace-normal px-1 text-center text-xs leading-tight"
          : "px-4 py-3 text-left text-base";
        return (
          <button
            key={room.id}
            type="button"
            data-testid={`room-nav-${room.id}`}
            aria-current={active ? "page" : undefined}
            onClick={() => onGo(room.id)}
            className={`rounded-sm border font-typewriter transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass ${size} ${tone}`}
          >
            {room.name}
          </button>
        );
      })}
    </>
  );
}

function RoomScene({ state, onOpenClue }: { state: GameState; onOpenClue: (id: ClueId) => void }) {
  const room = getRoom(state.currentRoom);
  const clues = cluesInRoom(room.id);

  return (
    <section
      aria-label="Current room"
      className="scene-lit relative overflow-hidden rounded-sm border border-steel p-6 sm:p-10"
    >
      <p className="font-typewriter text-xs uppercase tracking-[0.25em] text-brass">Evidence in this room</p>
      <h2 data-testid="room-title" className="mt-3 font-display text-4xl font-bold text-ash sm:text-5xl">
        {room.name}
      </h2>
      <p className="mt-4 max-w-prose text-base italic leading-relaxed text-smoke">{room.atmosphere}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        {clues.map((clue) => {
          const logged = state.examined.includes(clue.id);
          return (
            <button
              key={clue.id}
              type="button"
              data-testid={`clue-${clue.id}`}
              onClick={() => onOpenClue(clue.id)}
              className="flex items-center gap-3 rounded-sm border border-brass/50 bg-black/50 px-4 py-3 text-left font-typewriter text-ash transition-colors hover:border-brass hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
            >
              <span>{clue.name}</span>
              {logged && (
                <span className="rotate-[-3deg] border border-brass px-1.5 py-0.5 text-[0.65rem] uppercase tracking-widest text-brass">
                  Logged
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ClueDialog({ clueId, onClose }: { clueId: ClueId | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (clueId && !dialog.open) dialog.showModal();
    else if (!clueId && dialog.open) dialog.close();
  }, [clueId]);

  const clue = clueId ? getClue(clueId) : null;

  return (
    <dialog
      ref={ref}
      data-testid="clue-dialog"
      aria-labelledby="clue-dialog-title"
      onClose={onClose}
      onClick={(e) => {
        // Clicking the backdrop (outside the card) closes it.
        if (e.target === e.currentTarget) ref.current?.close();
      }}
      className="m-auto w-[min(92vw,30rem)] border-0 bg-transparent p-0 text-ink"
    >
      {clue && (
        <article className="bg-paper p-6 font-typewriter shadow-2xl sm:p-8">
          <p className="text-[0.7rem] uppercase tracking-[0.25em] text-ink/60">Evidence card</p>
          <h3 id="clue-dialog-title" className="mt-2 font-display text-2xl font-bold">
            {clue.name}
          </h3>
          <p className="mt-4 text-base leading-relaxed">{clue.text}</p>
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              data-testid="clue-dialog-close"
              onClick={() => ref.current?.close()}
              className="rounded-sm border border-ink px-5 py-2 font-typewriter text-sm text-ink transition-colors hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
            >
              Close
            </button>
          </div>
        </article>
      )}
    </dialog>
  );
}

function NotebookPanel({ state, onClose }: { state: GameState; onClose?: () => void }) {
  const found = state.notebook.length;
  return (
    <section
      data-testid="notebook-panel"
      aria-labelledby="notebook-heading"
      className="flex flex-col gap-4 rounded-sm border border-steel bg-[#111116] p-5"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 id="notebook-heading" className="font-display text-2xl text-ash">
          Notebook
        </h2>
        {onClose && (
          <button
            type="button"
            data-testid="notebook-close"
            onClick={onClose}
            className={btnGhost}
          >
            Close
          </button>
        )}
      </div>
      <p data-testid="notebook-count" className="font-typewriter text-sm text-brass">
        {found} of {TOTAL_CLUES} clues
      </p>
      {found === 0 ? (
        <p className="text-sm text-smoke">No clues logged yet. Open the evidence in each room.</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {state.notebook.map((id) => {
            const clue = getClue(id);
            return (
              <li key={id} data-testid={`notebook-entry-${id}`} className="border-l-2 border-brass pl-3">
                <p className="font-typewriter text-sm text-ash">{clue.name}</p>
                <p className="line-clamp-2 text-xs leading-relaxed text-smoke">{clue.text}</p>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

function AccuseBlock({ state, dispatch }: { state: GameState; dispatch: Dispatch<GameAction> }) {
  const unlocked = canAccuse(state);
  return (
    <section className="flex flex-col gap-3 rounded-sm border border-steel bg-black/40 p-5">
      <button
        type="button"
        data-testid="accuse-button"
        disabled={!unlocked}
        onClick={() => dispatch({ type: "OPEN_ACCUSATION" })}
        className={btnBlood}
      >
        Make an Accusation
      </button>
      {!unlocked && (
        <p data-testid="accuse-locked-message" className="text-sm text-smoke">
          Find at least {REQUIRED_CLUES} clues before you accuse ({state.notebook.length} of {REQUIRED_CLUES} found)
        </p>
      )}
    </section>
  );
}
