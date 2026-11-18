# Bugs Kane caught

No real bugs caught during the build. The demo bug in DEMO is planted on purpose.

Kane did flag one replay miss on `restart`: a recorded Tab and Enter sequence left focus on the footer, so the run was still in The Lounge and Eddie's IOU was not on screen. Kane classified that as an automation miss, re-authored the step, and `kane/flows/output-restart/Result.md` is passed. No app change was made for it.

Two earlier suites exited 2 and never started. Chrome was not installed, then the Windows runner package `@testmuai/kane-cli-win-x64` was missing. Those were the machine, not the game.
