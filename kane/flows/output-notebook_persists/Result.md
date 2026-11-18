---
test: ../notebook_persists_test.md
status: passed
started: 2026-11-18T22:02:38.523Z
duration_s: 168
session_id: 29e87607-85a7-45ac-b6a8-5d9c1aa36cd1
---

# Notebook keeps clues across rooms and reloads — Result

## Take the case ✓ passed (29.7s)
md5: 000244eec47b8aaf8dc28d6d4dd439a4
Click the "Take the Case" button.
Verify the room heading "The Lounge" is visible.

## Log one clue ✓ passed (39.1s)
md5: a6c63bab66aec6a12e1486c6eb4389d1
Click the clue called "Coat Check Stub", then close the clue card.
Verify the notebook lists "Coat Check Stub" and the counter reads "1 of 8 clues".

## Change rooms ✓ passed (43.3s)
md5: 492f46d4f26fc9e4bdd149cadd70e725
Use the room navigation to go to "The Bar", then to "The Office".
Verify the room heading "The Office" is visible, the notebook still lists "Coat Check Stub", and the counter still reads "1 of 8 clues".

## Reload the page ✓ passed (41.1s)
md5: f79c2e00a4f45caae965e23a561bf2f4
Reload the page.
Verify the notebook still lists "Coat Check Stub" and the counter reads "1 of 8 clues".
