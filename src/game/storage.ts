import { CLUES, ROOMS, SUSPECTS } from "./data";
import type { ClueId, GameState, Phase, RoomId, SuspectId } from "./types";

export const SAVE_KEY = "velvet-alibi-save-v1";

const PHASES: Phase[] = ["title", "investigating", "accusing", "ended"];
const clueIds = new Set<string>(CLUES.map((c) => c.id));
const roomIds = new Set<string>(ROOMS.map((r) => r.id));
const suspectIds = new Set<string>(SUSPECTS.map((s) => s.id));

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

// Only accept a save that matches the current shape. Anything else is ignored.
function parseSave(raw: unknown): GameState | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Record<string, unknown>;
  if (!PHASES.includes(s.phase as Phase)) return null;
  if (!roomIds.has(s.currentRoom as string)) return null;
  if (!isStringArray(s.notebook) || !s.notebook.every((id) => clueIds.has(id))) return null;
  if (!isStringArray(s.examined) || !s.examined.every((id) => clueIds.has(id))) return null;
  if (!isStringArray(s.visitedRooms) || !s.visitedRooms.every((id) => roomIds.has(id))) return null;
  if (s.accusedId !== null && !suspectIds.has(s.accusedId as string)) return null;
  return {
    phase: s.phase as Phase,
    currentRoom: s.currentRoom as RoomId,
    notebook: s.notebook as ClueId[],
    examined: s.examined as ClueId[],
    visitedRooms: s.visitedRooms as RoomId[],
    ending: (s.ending as GameState["ending"]) ?? null,
    accusedId: (s.accusedId as SuspectId | null) ?? null,
  };
}

export function loadSave(): GameState | null {
  try {
    const text = window.localStorage.getItem(SAVE_KEY);
    return text ? parseSave(JSON.parse(text)) : null;
  } catch {
    return null;
  }
}

export function saveState(state: GameState): void {
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // storage full or blocked: the game still works, it just will not persist
  }
}

export function clearSave(): void {
  try {
    window.localStorage.removeItem(SAVE_KEY);
  } catch {
    // ignore
  }
}
