---
test: ../accuse_locked_test.md
status: passed
started: 2026-11-18T21:05:44.649Z
duration_s: 209
session_id: 2de1c566-3138-45cb-9490-ebd051f93df6
---

# You cannot accuse anyone before finding three clues — Result

## Take the case ✓ passed (43.4s)
md5: 000244eec47b8aaf8dc28d6d4dd439a4
Click the "Take the Case" button.
Verify the room heading "The Lounge" is visible.

## Accusation is locked at zero clues ✓ passed (34.2s)
md5: 2deda52e176e938f5cfe914dd8fc84e3
Verify the "Make an Accusation" button is disabled and the text "Find at least 3 clues before you accuse" is visible.

## Still locked at two clues ✓ passed (56.5s)
md5: 05b21f3257b9ac5d44e3e857b3f543d8
Click the clue "Coat Check Stub" and close the clue card, then click the clue "Amsel Pharmacy Matchbook" and close the clue card.
Verify the notebook counter reads "2 of 8 clues" and the "Make an Accusation" button is still disabled.

## Unlocks at three clues ✓ passed (50.2s)
md5: d939bc9dc4065c493d802f72fc8939a3
Use the room navigation to go to "The Bar", click the clue "Eddie's IOU" and close the clue card.
Verify the "Make an Accusation" button is now enabled.
