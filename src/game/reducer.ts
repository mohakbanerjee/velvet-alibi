import { canAccuse, examineClue, accuse } from "./rules";
import type { ClueId, GameState, RoomId, SuspectId } from "./types";

export const initialState: GameState = {
  phase: "title",
  currentRoom: "lounge",
  notebook: [],
  examined: [],
  visitedRooms: [],
  ending: null,
  accusedId: null,
};

export type GameAction =
  | { type: "START" }
  | { type: "GO_TO_ROOM"; room: RoomId }
  | { type: "EXAMINE_CLUE"; clueId: ClueId }
  | { type: "OPEN_ACCUSATION" }
  | { type: "CANCEL_ACCUSATION" }
  | { type: "ACCUSE"; suspectId: SuspectId }
  | { type: "RESTART" }
  | { type: "HYDRATE"; state: GameState };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START":
      return {
        ...initialState,
        phase: "investigating",
        currentRoom: "lounge",
        visitedRooms: ["lounge"],
      };

    case "GO_TO_ROOM":
      return {
        ...state,
        currentRoom: action.room,
        visitedRooms: state.visitedRooms.includes(action.room) ? state.visitedRooms : [...state.visitedRooms, action.room],
        notebook: state.notebook, // keep notebook across rooms
      };

    case "EXAMINE_CLUE":
      if (state.phase !== "investigating") return state;
      return examineClue(state, action.clueId);

    case "OPEN_ACCUSATION":
      if (state.phase !== "investigating" || !canAccuse(state)) return state;
      return { ...state, phase: "accusing" };

    case "CANCEL_ACCUSATION":
      if (state.phase !== "accusing") return state;
      return { ...state, phase: "investigating" };

    case "ACCUSE": {
      if (state.phase !== "accusing" || !canAccuse(state)) return state;
      const result = accuse(state, action.suspectId);
      return { ...state, phase: "ended", ending: result.id, accusedId: action.suspectId };
    }

    case "RESTART":
      return initialState;

    case "HYDRATE":
      return action.state;

    default:
      return state;
  }
}
