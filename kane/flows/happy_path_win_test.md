---
mode: testing
url: http://localhost:3000/?fresh=1
tags: [smoke, core]
---

# Solve the case and win

## Take the case
Click the "Take the Case" button.
Verify the room heading "The Lounge" is visible and the notebook counter reads "0 of 8 clues".

## Find the coat check stub
Click the clue called "Coat Check Stub", then close the clue card.
Verify the notebook counter reads "1 of 8 clues".

## Find the pharmacy receipt
Use the room navigation to go to "The Bar". Click the clue called "Pharmacy Receipt", then close the clue card.
Verify the notebook counter reads "2 of 8 clues".

## Find the torn ledger page
Use the room navigation to go to "The Office". Click the clue called "Torn Ledger Page", then close the clue card.
Verify the notebook counter reads "3 of 8 clues".

## Accuse Rosa Vance
Click "Make an Accusation", choose the suspect "Rosa Vance", then click "Confirm Accusation".
Verify the ending screen shows the heading "Case Solved".
