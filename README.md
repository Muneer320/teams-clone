# TeamsClone task simulator

This repository contains a Microsoft Teams-inspired interface and a small collaboration-task simulator. The original 2025 hackathon prototype explored whether an agent could learn to navigate chats, channels and meeting invitations. The current demo has five scripted tasks, a rule-based Python baseline, and a Gymnasium adapter around the backend API. There is **no trained RL model or measured training result** in this repository. The simulator uses its own in-memory conversations; it does not control the web app's SQLite chat.

## Run the demo

Use Node.js 20+, Python 3.13 and npm. In one terminal:

```bash
npm ci
npm run install:all
npm run dev
```

The frontend opens at `http://localhost:5173`; the backend health endpoint is `http://localhost:3001/health`. In a second terminal:

```bash
npm run demo -- --task greeting_response
npm run demo -- --task channel_explorer
npm run demo -- --task active_participant
npm run demo -- --task meeting_joiner
npm run demo -- --task social_butterfly
```

Each command starts a real API episode and prints the actions, rewards and completion state. The rule-based baseline completes all five tasks. For a container demo, `docker compose up --build` serves the same frontend and backend on ports 5173 and 3001, bound to localhost. Stop it with `docker compose down`; the SQLite data lives in the `teams_data` volume. Set `JWT_SECRET` in a root `.env` for Compose, or `backend/.env` for local npm runs, before running a long-lived instance. If it is omitted, the backend creates a random key at startup and previous sessions expire on restart.

## What works

- `POST /env/reset`, `POST /env/step`, `GET /env/state?episodeId=...`, task discovery and episode stats. Episodes are isolated, held in memory, and capped at 100. A seed chooses reproducible message variants and scripted replies.
- Five tasks with validation against obvious reward shortcuts: distinct channels, substantive distinct messages, genuine greeting and meeting invitation, and reactions to distinct other-user messages.
- A Python HTTP client and Gymnasium wrapper with a 16-value observation and 12 discrete actions. See [Python agent notes](python_agent/README.md).
- A local React interface with account registration, sign-in, SQLite-backed direct messages, a meeting UI with local camera preview, and a per-user Activity feed. Chat refreshes every three seconds. Registration's `123456` code is explicitly a **demo-only UI step**; no email is sent. Video is a local preview; calls do not transmit media between users.
- Backend tests, frontend lint/build, and Docker Compose. [Environment rules](docs/ENVIRONMENT.md) describe the task simulator.

## Boundaries

The simulator is separate from the app's real users and messages. The old sample episode JSON, plots, notebooks and unimplemented RL agent were removed because they implied training results that could not be reproduced. Calendar, Settings and hardcoded Communities pages were hidden from navigation. This is a local prototype; the old Vercel homepage has not been verified as a working deployment. The API uses an in-memory episode store and local SQLite, so it is suitable for one local process rather than a multi-instance service.

## Checks

```bash
npm test
npm --prefix frontend run lint
npm --prefix frontend run build
python -m pip install -r python_agent/requirements.txt
python python_agent/check_env.py
```

The browser demo can be opened directly after `npm run dev`. The API supports two-user chat; message routes require a valid bearer token and reject sender spoofing. Do not use real personal accounts or production secrets in this prototype.
