export type RoomId = "lounge" | "bar" | "dressing" | "office";

export type ClueId =
  | "coat-stub"
  | "matchbook"
  | "receipt"
  | "iou"
  | "contract"
  | "lipstick-glass"
  | "ledger"
  | "bourbon";

export type SuspectId = "lila" | "eddie" | "rosa" | "felix";

export type EndingId = "solved-airtight" | "solved-lucky" | "wrong";

export type Phase = "title" | "investigating" | "accusing" | "ended";

export interface Room {
  id: RoomId;
  name: string;
  atmosphere: string;
}

export interface Clue {
  id: ClueId;
  roomId: RoomId;
  name: string;
  text: string;
  key: boolean;
  points: SuspectId | null;
}

export interface Suspect {
  id: SuspectId;
  name: string;
  role: string;
  motive: string;
  wrongFlavour: string;
}

export interface GameState {
  phase: Phase;
  currentRoom: RoomId;
  notebook: ClueId[];
  examined: ClueId[];
  visitedRooms: RoomId[];
  ending: EndingId | null;
  accusedId: SuspectId | null;
}

export interface EndingResult {
  id: EndingId;
  heading: string;
  subtitle: string;
  epilogue: string | null;
  missedKeyClues: ClueId[];
}
