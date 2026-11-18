---
mode: testing
url: http://localhost:3000/?fresh=1
tags: [core]
---

# You cannot accuse anyone before finding three clues

## Take the case
Click the "Take the Case" button.
Verify the room heading "The Lounge" is visible.

## Accusation is locked at zero clues
Verify the "Make an Accusation" button is disabled and the text "Find at least 3 clues before you accuse" is visible.

## Still locked at two clues
Click the clue "Coat Check Stub" and close the clue card, then click the clue "Amsel Pharmacy Matchbook" and close the clue card.
Verify the notebook counter reads "2 of 8 clues" and the "Make an Accusation" button is still disabled.

## Unlocks at three clues
Use the room navigation to go to "The Bar", click the clue "Eddie's IOU" and close the clue card.
Verify the "Make an Accusation" button is now enabled.
