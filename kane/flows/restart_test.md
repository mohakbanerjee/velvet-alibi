---
mode: testing
url: http://localhost:3000/?fresh=1
tags: [core]
---

# Play again resets the whole case

## Take the case
Click the "Take the Case" button.
Verify the room heading "The Lounge" is visible.

## Reach an ending
Click the clue "Coat Check Stub" and close the clue card, then click the clue "Amsel Pharmacy Matchbook" and close the clue card. Use the room navigation to go to "The Bar", click the clue "Eddie's IOU" and close the clue card. Click "Make an Accusation", choose "Dr. Felix Amsel", then click "Confirm Accusation".
Verify the ending screen shows the heading "Wrong Suspect".

## Play again
Click the "Play Again" button.
Verify the "Take the Case" button is visible.

## Fresh notebook
Click the "Take the Case" button.
Verify the room heading "The Lounge" is visible and the notebook counter reads "0 of 8 clues".
