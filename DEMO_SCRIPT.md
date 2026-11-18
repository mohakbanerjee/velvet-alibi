# Demo rehearsal

Show the closed loop once, with the planted bug. Keep the dev server running on http://localhost:3000 and stay signed in to Kane CLI.

1. Confirm the game is healthy: `npm run demo:bug-status` should print `healthy`.
2. Plant the bug: `npm run demo:plant-bug`. This makes `GO_TO_ROOM` wipe the notebook.
3. Commit that change so the before and after are visible in git.
4. Turn the loop on if it is off: `npm run kane:hook:on`.
5. In Cursor agent mode, ask it to read `.kane/FAILURES.md` after you run `npm run kane:smoke`. Kane should fail `notebook_persists_test` because the notebook loses "Coat Check Stub" when you leave The Lounge.
6. Let Cursor fix `src/game/reducer.ts` only. It should restore `notebook: state.notebook, // keep notebook across rooms`.
7. The stop hook runs Kane again. When it passes, run `npm run demo:bug-status` and confirm it prints `healthy`.
8. If you need to undo the plant by hand, `npm run demo:unplant-bug` is the emergency reset. In the recording, let Cursor make the fix.
