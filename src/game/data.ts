import type { Clue, Room, RoomId, Suspect, SuspectId, ClueId } from "./types";

export const ROOMS: Room[] = [
  {
    id: "lounge",
    name: "The Lounge",
    atmosphere: "Velvet booths, a dead piano, and a coat rack that has seen better nights.",
  },
  {
    id: "bar",
    name: "The Bar",
    atmosphere: "Brass rails, a row of dusty bottles, and a bartender who will not meet your eye.",
  },
  {
    id: "dressing",
    name: "The Dressing Room",
    atmosphere: "Bulbs around a cracked mirror, a rack of sequins, and the smell of cold cigarettes.",
  },
  {
    id: "office",
    name: "The Office",
    atmosphere: "A desk under a green lamp, a safe with its door ajar, and ledgers stacked like tombstones.",
  },
];

export const CLUES: Clue[] = [
  {
    id: "coat-stub",
    roomId: "lounge",
    name: "Coat Check Stub",
    text: 'Ticket 47, a grey wool coat. The coat girl\'s pencil note: "Miss Vance, collected 11:52 PM." Rosa told the police she went home at ten.',
    key: true,
    points: "rosa",
  },
  {
    id: "matchbook",
    roomId: "lounge",
    name: "Amsel Pharmacy Matchbook",
    text: "A matchbook from Amsel's Pharmacy on Dock Street, half the matches gone. Dr. Amsel smokes at every table he sits at.",
    key: false,
    points: "felix",
  },
  {
    id: "receipt",
    roomId: "bar",
    name: "Pharmacy Receipt",
    text: 'Amsel\'s Pharmacy, dated today. One tin of strychnine rat poison, "for the cellar". Signed R. Vance in neat green ink.',
    key: true,
    points: "rosa",
  },
  {
    id: "iou",
    roomId: "bar",
    name: "Eddie's IOU",
    text: "A crumpled IOU for $800 to a man called Lucky Sal, due Friday. Eddie Crane's signature shakes.",
    key: false,
    points: "eddie",
  },
  {
    id: "contract",
    roomId: "dressing",
    name: "Torn Contract",
    text: 'Lila Marlowe\'s five year contract, ripped in half. Victor\'s note in the margin: "You sing here or you sing nowhere."',
    key: false,
    points: "lila",
  },
  {
    id: "lipstick-glass",
    roomId: "dressing",
    name: "Lipstick Glass",
    text: "A champagne glass with red lipstick on the rim. It smells of champagne, nothing bitter. Lila drank with someone tonight.",
    key: false,
    points: "lila",
  },
  {
    id: "ledger",
    roomId: "office",
    name: "Torn Ledger Page",
    text: "The club ledger, last page torn out. The stub still shows entries in green ink initialled R.V. and a running total $12,000 short.",
    key: true,
    points: "rosa",
  },
  {
    id: "bourbon",
    roomId: "office",
    name: "Bourbon Glass",
    text: "Victor's glass. A bitter smell, sharp and wrong. The coroner will say strychnine before dawn.",
    key: false,
    points: null,
  },
];

export const SUSPECTS: Suspect[] = [
  {
    id: "lila",
    name: "Lila Marlowe",
    role: "Headline singer",
    motive: "Victor refused to release her from her contract.",
    wrongFlavour:
      "Lila Marlowe spends the night in a back room, still humming the last set. The real killer walks out into the rain.",
  },
  {
    id: "eddie",
    name: "Eddie Crane",
    role: "Bartender",
    motive: "Owes money to a bookie. Victor threatened to fire him.",
    wrongFlavour:
      "Eddie spends the night in a cell, swearing on his mother. The real killer walks out into the rain.",
  },
  {
    id: "rosa",
    name: "Rosa Vance",
    role: "Bookkeeper and Victor's partner",
    motive: 'Says she went home at 10 PM. Victor called her "the only honest one".',
    wrongFlavour: "",
  },
  {
    id: "felix",
    name: "Dr. Felix Amsel",
    role: "Pharmacist and regular",
    motive: "Victor owed him money and laughed about it.",
    wrongFlavour:
      "Dr. Amsel is escorted out of the Lantern with his matchbooks and his dignity, both somewhat bent. The real killer walks out into the rain.",
  },
];

export const KILLER_ID: SuspectId = "rosa";
export const KEY_CLUE_IDS: ClueId[] = CLUES.filter((c) => c.key).map((c) => c.id);
export const TOTAL_CLUES = CLUES.length;

export function getRoom(id: RoomId): Room {
  const room = ROOMS.find((r) => r.id === id);
  if (!room) throw new Error(`Unknown room: ${id}`);
  return room;
}

export function getClue(id: ClueId): Clue {
  const clue = CLUES.find((c) => c.id === id);
  if (!clue) throw new Error(`Unknown clue: ${id}`);
  return clue;
}

export function getSuspect(id: SuspectId): Suspect {
  const suspect = SUSPECTS.find((s) => s.id === id);
  if (!suspect) throw new Error(`Unknown suspect: ${id}`);
  return suspect;
}

export function cluesInRoom(roomId: RoomId): Clue[] {
  return CLUES.filter((c) => c.roomId === roomId);
}
