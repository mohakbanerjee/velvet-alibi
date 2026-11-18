---
mode: testing
url: http://localhost:3000/?fresh=1
tags: [smoke, core]
---

# Notebook keeps clues across rooms and reloads

## Take the case
Click the "Take the Case" button.
Verify the room heading "The Lounge" is visible.

## Log one clue
Click the clue called "Coat Check Stub", then close the clue card.
Verify the notebook lists "Coat Check Stub" and the counter reads "1 of 8 clues".

## Change rooms
Use the room navigation to go to "The Bar", then to "The Office".
Verify the room heading "The Office" is visible, the notebook still lists "Coat Check Stub", and the counter still reads "1 of 8 clues".

## Reload the page
Reload the page.
Verify the notebook still lists "Coat Check Stub" and the counter reads "1 of 8 clues".
