# Mr. Martian Project Overview

A TypeScript-based, web survival and adventure game set on Mars. The project combines tile-based strategy elements with a Phaser-based action mini-game.

## Core Technologies
- **Language:** TypeScript
- **Frontend Framework:** Vue.js 2 (for UI and game state management)
- **Game Engine:** Phaser CE (used for the "Final Game" mode)
- **Bundler:** Webpack 5
- **UI/Styles:** Bootstrap, jQuery, and Vanilla CSS
- **Utilities:** Node.js, npm

## Project Structure
- `src/JS/game.ts`: The main entry point. Initializes the Vue application (`gameApp`) and manages the main game loop, map interactions, and turn logic.
- `src/JS/Player.ts`: Defines the `Player` class, managing health, food, water, stone, morale, and inventory.
- `src/JS/Maps/`: Contains logic for the tile-based map (`Map.ts`), tile data (`Tile.ts`), and pathfinding (`DetermineShortestPath.ts`).
- `src/JS/MiningLocations/`: Contains the various building types (`Well`, `Shelter`, `Farm`, `Mine`, `Lab`) that inherit from a base `Building` class.
- `src/JS/FinalGame/`: A dedicated action mini-game implemented using Phaser CE, triggered at specific points in the story.
- `src/JS/RandomEvents/`: Handles daily events (`SolEvent.ts`) and random occurrences (`RandomEventController.ts`).
- `src/JS/Story/`: Manages story progression and cinematic-style slides (`StoryController.ts`).
- `src/IMG/`: Asset directory for game sprites, map tiles, and story images.

## Building and Running

### Development
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server (with hot reloading):
   ```sh
   npm run start
   ```
   The application will be available at `http://localhost:3000`.

### Production
1. Build the project:
   ```sh
   npm run build
   ```
   This generates a bundled `app.js` in the `dist/` directory.

## Key Game Mechanics
- **Survival:** Players must manage daily food and water consumption. Lack of resources leads to health and morale depletion.
- **Building:** Players can construct and upgrade buildings on map tiles to gather resources or provide shelter.
- **Turns/Sols:** The game progresses in "Sols" (Mars days). Each player has a limited number of hours per day, which can be affected by morale.
- **Shelter:** Sleeping outside a shelter at the end of a turn causes significant health and morale loss.
- **Story:** Progression is driven by a series of story events triggered by the `Sol` count.

## Development Conventions
- **State Management:** The global `gameApp` Vue instance is used as a central state store for the game.
- **Object-Oriented Design:** Buildings, Players, and Events are implemented as TypeScript classes with inheritance.
- **Asset Loading:** Phaser assets are preloaded in the `preload()` method of the `FinalGame` class. Static assets for the main map are typically loaded via standard URL paths in `src/IMG/`.
- **UI Integration:** The game uses a mix of Vue components for persistent UI and jQuery-triggered Bootstrap modals for interactive events (construction, turn results, story).

## TODO / Future Improvements
- [ ] Refactor `calcRationUsageAndEvents` in `game.ts` into a dedicated service.
- [ ] Improve integration between the main Vue app and the Phaser-based Final Game.
- [ ] Standardize modal management (currently a mix of Vue and direct jQuery).
