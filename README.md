# Velvet Alibi

You solve the murder. Kane solves the bugs.

Port Halcyon, 1947. Victor Hale is dead at his desk in The Velvet Lantern, and you have until dawn to name the killer. Search four rooms, log the clues in your notebook, and make one accusation.

## Play it

Live site: https://velvet-alibi.vercel.app

To play on your own machine:

```
npm install && npm run dev
```

Then open http://localhost:3000.

## How it was built

Cursor (agent mode) wrote the code from one spec. Kane CLI by TestMu AI verified it in a real Chrome.

## The loop

1. Cursor edits `src/`.
2. The afterFileEdit hook marks the change.
3. The stop hook runs Kane on the smoke flows.
4. A failure is written to `.kane/FAILURES.md` and sent back to Cursor as its next message.
5. Cursor fixes the code and the hook runs Kane again until green.

For edits you make by hand, run `npm run kane:watch`. It watches `src/` and runs the smoke flows after each save.

## What Kane checks

| Flow | What it proves |
|---|---|
| `happy_path_win_test` | Finding the three key clues and accusing Rosa Vance ends with "Case Solved". |
| `notebook_persists_test` | Logged clues stay in the notebook when you change rooms and reload. |
| `accuse_locked_test` | "Make an Accusation" stays disabled until three clues are found. |
| `wrong_accusation_lose_test` | Accusing Eddie Crane ends with "Wrong Suspect". |
| `restart_test` | "Play Again" returns to the title screen with an empty notebook. |
| `mobile_layout_test` | Below 900px the notebook sits behind a button and rooms move to a bottom bar. |

## Run the Kane checks yourself

You need Node 18 or newer, Google Chrome, and a free TestMu AI account.

```
npm install -g @testmuai/kane-cli
kane-cli login
npm install
npm run dev
npm run kane:check
```

To check the live site instead of localhost:

```
npm run kane:check -- --url=https://velvet-alibi.vercel.app
```

## Proof

* Run history: [kane/RUN_LOG.md](kane/RUN_LOG.md)
* Bugs Kane caught: [kane/CAUGHT.md](kane/CAUGHT.md)
* Per step reports: `kane/flows/output-*/Result.md`

## Honesty note

The demo video plants one bug on purpose with `npm run demo:plant-bug` (the notebook forgets clues when you change rooms) so you can watch Kane catch it and Cursor fix it. Real catches from the build are listed in `kane/CAUGHT.md`.

## Stack

Next.js, TypeScript, Tailwind, Vercel, Cursor, Kane CLI.

## Team

Built by Mohak
