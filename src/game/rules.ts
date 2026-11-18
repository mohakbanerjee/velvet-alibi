import { KEY_CLUE_IDS, KILLER_ID, getClue, getSuspect } from "./data";
import type { ClueId, EndingResult, GameState, SuspectId } from "./types";

export const REQUIRED_CLUES = 3;

export function canAccuse(state: Pick<GameState, "notebook">): boolean {
  return state.notebook.length >= REQUIRED_CLUES;
}

export function examineClue(state: GameState, clueId: ClueId): GameState {
  const examined = state.examined.includes(clueId) ? state.examined : [...state.examined, clueId];
  const notebook = state.notebook.includes(clueId) ? state.notebook : [...state.notebook, clueId];
  return { ...state, examined, notebook };
}

export function missedKeyClues(notebook: ClueId[]): ClueId[] {
  return KEY_CLUE_IDS.filter((id) => !notebook.includes(id));
}

export function accuse(state: Pick<GameState, "notebook">, suspectId: SuspectId): EndingResult {
  if (suspectId === KILLER_ID) {
    const missed = missedKeyClues(state.notebook);
    if (missed.length === 0) {
      const names = KEY_CLUE_IDS.map((id) => getClue(id).name);
      return {
        id: "solved-airtight",
        heading: "Case Solved",
        subtitle: "Airtight. Rosa Vance confesses before the coffee goes cold.",
        epilogue: `The coat stub put her in the lounge at 11:52. The pharmacy receipt put the strychnine in her hand. The torn ledger page showed the $12,000 she skimmed. Key evidence: ${names.join(", ")}.`,
        missedKeyClues: [],
      };
    }
    const missedNames = missed.map((id) => getClue(id).name).join(", ");
    return {
      id: "solved-lucky",
      heading: "Case Solved",
      subtitle: "A lucky guess. Her lawyer will have a field day.",
      epilogue: `You missed key evidence: ${missedNames}.`,
      missedKeyClues: missed,
    };
  }

  const suspect = getSuspect(suspectId);
  return {
    id: "wrong",
    heading: "Wrong Suspect",
    subtitle: suspect.wrongFlavour,
    epilogue: null,
    missedKeyClues: [],
  };
}
