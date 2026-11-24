# HW10: Chrome DevTools Meowth Giga Pet

An extended copy of **Project 2 (Meowth Giga Pet)** created in an isolated repository to practice and document Chrome DevTools Console logging, browser diagnostics, Console filtering, and Sources panel JavaScript debugging.

**Github Pages Link:** https://steamfortress02.github.io/comp484-hw10-devtools/

## Documentation & Screenshots

- **PDF Documentation:** [`assets/hw10-devtools-documentation.pdf`](assets/hw10-devtools-documentation.pdf)

## Implemented DevTools Features

1. **Console Message Logging** (`script.js`):
   - `console.info()` / `console.log()` (`logInfoDemo`)
   - `console.warn()` (`logWarningDemo` & low-energy `clickedExerciseButton`)
   - `console.error()` (`logErrorDemo` & zero-energy `clickedExerciseButton`)
   - `console.table()` (`logTableDemo` displaying `petActionTable`)
   - `console.group()` / `console.groupEnd()` (`logGroupDemo`)
   - Custom `%c` CSS styling (`logCustomDemo`)
2. **Browser-Logged Diagnostics** (`script.js`):
   - **404 Network Error:** `fetch('api/missing-meowth-treats.json')` (`trigger404Demo`)
   - **Uncaught TypeError:** invoking `.squeak()` on `undefined` (`triggerTypeErrorDemo`)
   - **Performance Violation:** 350 ms synchronous busy-wait in a click handler (`triggerViolationDemo`, visible under DevTools *Verbose* / *All levels*)
3. **Console Filtering Demonstrations:**
   - Filter by log level (*Errors*, *Warnings*, *Info*)
   - Filter by keyword text (`energy`) and regular expression (`/Warning|Error/i`)
   - Filter by message source (`script.js`) and *User messages* in the Console Sidebar
4. **Sources Panel Debugging Fix** (`clickedBonusTreatButton` in `script.js`):
   - Diagnosed string concatenation (`5 + "3" === "53"`) using a line-of-code breakpoint, Scope pane, Watch expressions, and the Console drawer, then fixed the calculation with `parseInt(..., 10)` and `isNaN()` validation so `5 + 3 = 8`.
