# ⚔️ AI Dungeon Master

> An AI-powered text RPG with dynamic storytelling, turn-based combat, and persistent character progression — built with a React frontend and a Python/FastAPI backend.

---

## 📖 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Backend](#backend)
  - [Architecture](#backend-architecture)
  - [Key Models](#key-models)
  - [LangGraph Workflow](#langgraph-workflow)
  - [API Endpoints](#api-endpoints)
  - [Combat System](#combat-system)
  - [Session Management](#session-management)
  - [Logging](#logging)
  - [Setup & Running](#backend-setup--running)
- [Frontend](#frontend)
  - [Architecture](#frontend-architecture)
  - [Pages & Components](#pages--components)
  - [API Service](#api-service)
  - [Setup & Running](#frontend-setup--running)
- [How to Run the Full Stack](#how-to-run-the-full-stack)
- [Environment Variables](#environment-variables)
- [Game Features](#game-features)

---

## Project Overview

**AI Dungeon Master** is a full-stack, AI-driven text RPG. Players create a character, get dropped into a dynamically generated world, and experience a living narrative shaped by their choices. The game features:

- **AI-generated world & quests** using Google Gemini 2.5 Flash via LangChain
- **Turn-based combat** against a variety of enemies (Goblin, Orc, Skeleton, Dragon Boss, Necromancer, etc.)
- **Character progression** — levels, attributes (STR/DEX/INT/CON/WIS/CHA), skills, inventory, and gold
- **Stateful sessions** — each player's game state persists server-side for 60 minutes
- **Reactive frontend** — a dark-fantasy-themed React UI with animated transitions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router v7, Framer Motion, Tailwind CSS, Axios |
| Backend | Python, FastAPI, Uvicorn |
| AI / Orchestration | LangChain, LangGraph, Google Gemini 2.5 Flash (`langchain-groq`) |
| Data Validation | Pydantic v2 |
| Logging | Python `logging` with structured JSON output |
| Voice (optional) | ElevenLabs |

---

## Project Structure

```
project-root/
├── backend/
│   ├── main.py                  # FastAPI app, all API routes
│   ├── graph_builder.py         # LangGraph workflow construction
│   ├── requirements.txt
│   ├── models/
│   │   ├── game_state.py        # Core GameState, CharacterStats, Attributes
│   │   └── enemy.py             # Enemy models, factory functions
│   ├── nodes/
│   │   ├── start_session_node.py
│   │   ├── world_and_quest_node.py   # AI world generation
│   │   ├── narration_node.py
│   │   ├── action_input_node.py
│   │   └── action_resolution_node.py # AI action narration
│   ├── services/
│   │   ├── session_manager.py   # In-memory session store (TTL-based)
│   │   └── combat_system.py     # Full turn-based combat engine
│   └── utils/
│       └── logger.py            # Structured logging utilities
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx              # Root router & global state
        ├── main.jsx
        ├── pages/
        │   └── LandingPage.jsx  # Marketing/hero landing page
        ├── components/
        │   ├── CharacterCreation.jsx
        │   ├── GameScreen.jsx
        │   ├── CombatView.jsx
        │   ├── LoadingSpinner.jsx
        │   └── ErrorMessage.jsx
        └── services/
            └── api.js           # Axios API client & all endpoint wrappers
```

---

## Backend

### Backend Architecture

The backend is a **FastAPI** application that uses **LangGraph** to orchestrate the AI game loop. Each player session has its own isolated `GameState` object stored in an in-memory `SessionManager`.

The flow on game start:

```
start_session → world_and_quest → narration → action_input → action_resolution
```

For every subsequent player action, only the `action_resolution` node is invoked via a lightweight action-only graph.

Combat runs outside LangGraph — it's handled by a dedicated `CombatSystem` instance per session, which is stored in a `combat_systems` dict keyed by `session_id`.

---

### Key Models

#### `GameState` (`models/game_state.py`)

The central state object, a Pydantic `BaseModel` that holds everything:

- `player_name`, `character_class`, `setting`
- `character_stats` — `CharacterStats` (HP, mana, stamina, level, XP, attribute/skill points)
- `attributes` — `Attributes` (STR, DEX, INT, CON, WIS, CHA, each 1–20)
- `inventory` — list of item strings
- `gold` — integer
- `status_effects` — list of dicts with name, duration, effect
- `in_combat` — bool
- `world_intro`, `location_intro`, `current_npcs`, `main_quest` — AI-generated narrative fields
- `story_history` — running list of past narration events
- `current_narration`, `player_action`, `action_result`
- `game_started`, `game_over`

Key method: `update_character_stats()` recalculates max HP / mana / stamina from current attributes and level using D&D-style modifiers: `(attribute - 10) // 2`.

#### `Attributes` (`models/game_state.py`)

Six stats (all default 10, range 1–20):

| Attribute | Affects |
|---|---|
| Strength | Melee damage, carry capacity, physical checks |
| Dexterity | Ranged damage, dodge, stealth, lockpicking |
| Intelligence | Magic damage, mana pool, puzzle solving |
| Constitution | HP, stamina, disease/poison resistance |
| Wisdom | Perception, insight, spell accuracy, social |
| Charisma | Persuasion, intimidation, NPC reactions |

#### `Enemy` (`models/enemy.py`)

Each enemy has HP, attack, defense, speed, `AIBehavior` (aggressive/defensive/cowardly/tactical), a list of `EnemyAbility` objects with damage, cooldowns, and status effects. Boss enemies have multiple combat phases.

Available enemy factory functions: `create_goblin`, `create_orc`, `create_skeleton`, `create_necromancer`, `create_dragon_boss`, `spawn_random_enemy`.

---

### LangGraph Workflow

Defined in `graph_builder.py`. Two graphs are compiled:

**Main graph** (used on game start):
```
start_session → world_and_quest → narration → action_input → action_resolution → END
```

**Action-only graph** (used on every player action during gameplay):
```
action_resolution → END
```

Each node is a pure function that receives a `GameState`, modifies it, and returns the updated state. The `world_and_quest` node calls the Gemini AI model to generate the 4-section world intro (world description, starting location, key NPCs, main quest hook).

---

### API Endpoints

Base URL: `http://localhost:8000`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API welcome + active session count |
| POST | `/game/start` | Start a new game, returns `session_id` |
| POST | `/game/{session_id}/action` | Submit a player action, returns narration |
| GET | `/game/{session_id}` | Get full current game state |
| GET | `/game/{session_id}/character` | Get character sheet |
| POST | `/game/{session_id}/attribute` | Spend an attribute point |
| DELETE | `/game/{session_id}` | End a game session |
| POST | `/game/{session_id}/combat/start` | Initiate combat, specify enemy type/level/count |
| POST | `/game/{session_id}/combat/action` | Perform a combat action (attack/ability/defend/item/flee) |
| GET | `/game/{session_id}/combat/status` | Get current combat state |
| POST | `/game/{session_id}/combat/end` | Force-end combat |

**Request body for `/game/start`:**
```json
{
  "player_name": "Aether",
  "character_class": "Mage",
  "setting": "Dark Fantasy Medieval Kingdom"
}
```

**Request body for `/game/{session_id}/combat/start`:**
```json
{
  "enemy_type": "random",   // "random" | "boss" | "goblin" | "orc" | "necromancer"
  "enemy_level": 1,
  "enemy_count": 2
}
```

**Request body for `/game/{session_id}/combat/action`:**
```json
{
  "action_type": "attack",  // "attack" | "ability" | "defend" | "item" | "flee"
  "target_index": 0,
  "ability_name": null,     // required when action_type is "ability"
  "item_name": null         // required when action_type is "item"
}
```

---

### Combat System

`services/combat_system.py` implements a fully self-contained turn-based combat engine.

**Flow:**
1. `start_combat(game_state, enemies)` — initialises combat, sets `game_state.in_combat = True`
2. Player takes an action (attack / ability / defend / item / flee)
3. All living enemies take their AI turns based on their `AIBehavior`
4. Status effects (poisoned, stunned, burning, weakened, regenerating, defending) are ticked down
5. Victory → awards XP + gold + loot, checks level-up; Defeat → sets `game_over`

**Boss phases:** Dragon Boss transitions through phases (100%→50%→25% HP) with escalating abilities including `Ancient Fury`.

**Rewards on victory:**
- XP and gold from each enemy's `experience_reward` / `gold_reward`
- Random loot from the enemy's `loot_table`
- Automatic level-up if XP threshold crossed (every 1000 × level XP)

---

### Session Management

`services/session_manager.py` provides an in-memory key-value store:

- Sessions expire after **60 minutes** of inactivity (TTL-based)
- Maximum **1000 concurrent sessions**
- Background cleanup task runs every **5 minutes** to purge expired sessions
- Methods: `create_session`, `get_session`, `update_session`, `delete_session`, `cleanup_expired`, `get_session_count`

---

### Logging

`utils/logger.py` provides structured JSON logging via Python's standard `logging` module.

- `get_logger(name)` — returns a named logger
- `log_game_event(event_type, **context)` — logs game events with ISO timestamp
- `log_api_call(endpoint, method, status_code, response_time_ms)` — logs API performance
- `@log_execution_time` decorator — wraps functions to log start, completion, and errors with timing
- Sensitive keys (`password`, `api_key`, `token`, `secret`, `key`) are automatically redacted via `sanitize_sensitive_data`
- Log level and environment are configurable via `LOG_LEVEL` and `ENVIRONMENT` env vars

---

### Backend Setup & Running

**Requirements:** Python 3.10+

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Set environment variables (see Environment Variables section)

# Run the server
uvicorn main:app --reload --port 8000
```

The server will be available at `http://localhost:8000`. Interactive API docs at `http://localhost:8000/docs`.

---

## Frontend

### Frontend Architecture

Built with **React 19 + Vite**. Global state (session ID, game data, combat status) lives in `App.jsx` and is passed down as props. Routing is handled by **React Router v7** with three main routes.

---

### Pages & Components

#### `LandingPage` (`/`)
The hero/marketing page. Features an animated dark-fantasy design with the game title, a feature grid (Dynamic Combat, Living Narrative, Character Growth), a fake character card mockup, and a CTA button to `/create-character`. Uses Framer Motion for scroll-triggered animations.

#### `CharacterCreation` (`/create-character`)
Form for entering player name, selecting character class, and choosing a game setting. On submit, calls `gameApi.startGame()`. Shows `LoadingSpinner` during the API call and `ErrorMessage` on failure.

#### `GameScreen` (`/game`)
The main game interface. Displays the current narration, story history, character stats panel, inventory, and a text input for player actions. Calls `gameApi.takeAction()` on submit. Has a button to initiate combat.

#### `CombatView`
Rendered in place of `GameScreen` when `inCombat === true`. Shows enemy list with HP bars, player resource bars (HP/mana/stamina), action buttons (Attack, Abilities, Defend, Use Item, Flee), and a scrollable combat log with animated loading spinner between turns.

#### `LoadingSpinner`
Full-screen animated loading overlay with a multi-ring arcane spinner and bouncing dot indicators.

#### `ErrorMessage`
Full-screen error display with retry button.

---

### API Service

`src/services/api.js` exports a `gameApi` object with the following methods, all wrapping an Axios instance pointing to `http://localhost:8000`:

| Method | Description |
|---|---|
| `startGame(playerName, characterClass, setting)` | POST `/game/start` |
| `takeAction(sessionId, action)` | POST `/game/{sessionId}/action` |
| `getGameState(sessionId)` | GET `/game/{sessionId}` |
| `getCharacterSheet(sessionId)` | GET `/game/{sessionId}/character` |
| `spendAttributePoint(sessionId, attribute)` | POST `/game/{sessionId}/attribute` |
| `endGame(sessionId)` | DELETE `/game/{sessionId}` |
| `startCombat(sessionId, enemyType, enemyLevel, enemyCount)` | POST `/game/{sessionId}/combat/start` |
| `performCombatAction(sessionId, actionType, targetIndex, abilityName, itemName)` | POST `/game/{sessionId}/combat/action` |
| `getCombatStatus(sessionId)` | GET `/game/{sessionId}/combat/status` |
| `endCombat(sessionId)` | POST `/game/{sessionId}/combat/end` |

Timeout is set to **30 seconds** to accommodate AI generation latency.

---

### Frontend Setup & Running

**Requirements:** Node.js 18+

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

To build for production:
```bash
npm run build
```

---

## How to Run the Full Stack

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd backend
pip install -r requirements.txt
# add your .env file (see below)
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
# Required — Google Gemini API key (used by LangChain)
GOOGLE_API_KEY=your_google_gemini_api_key

# Optional — ElevenLabs for voice synthesis
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Optional — Logging configuration
LOG_LEVEL=INFO                  # DEBUG | INFO | WARNING | ERROR
ENVIRONMENT=development         # development | production
LOGGING_CONFIG_PATH=            # path to custom logging YAML (optional)
```

---

## Game Features

- **Dynamic world generation** — every new game produces a unique world, starting location, NPCs, and quest hook via Gemini AI
- **Free-form actions** — type anything; the AI narrates the outcome and updates the game state accordingly
- **D&D-style attributes** — six stats with modifiers affecting HP, mana, stamina, and skill checks
- **Attribute point spending** — level up to earn points, then spend them via the API or UI
- **Turn-based combat** — attack, use abilities (with cooldowns), defend (damage reduction), use items, or flee
- **Status effects** — poisoned, stunned, burning, weakened, regenerating, defending all tick per turn
- **Boss fights** — Dragon Boss with 3 escalating phases and a suite of abilities
- **Loot & inventory** — enemies drop items into your inventory on death
- **Persistent sessions** — reconnect to an active game within the 60-minute TTL window
- **CORS-open API** — easily connect any frontend or test client