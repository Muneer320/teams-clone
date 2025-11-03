# Task simulator rules

`POST /env/reset` accepts `taskType`, optional `episodeId`, and optional integer `seed`. Unknown tasks and reused episode IDs return HTTP 400. Use the returned `episodeId` on `POST /env/step` and `GET /env/state`, `/env/stats`, or `/env/actions`. Unknown IDs return 404 for state and step. `GET /env/tasks` lists the five supported tasks.

| Task | Completion condition |
|---|---|
| Greeting response | Reply in channel 1 with a greeting within five steps after an NPC greeting |
| Channel explorer | Visit three distinct channels, including the starting one |
| Active participant | Send five distinct, substantial, topic-related messages |
| Meeting joiner | Join a channel containing an NPC invitation addressed to the agent |
| Social butterfly | React to three distinct NPC messages and send three distinct, substantial messages |

Actions are `send_message`, `switch_channel`, `react_to_message`, `join_call` and `set_status`. Invalid actions earn a negative reward. An episode ends when the task completes, its step limit is reached, or too many invalid actions occur. The environment is a small scripted simulator: seeded greeting variants and NPC replies provide limited variability, and its text checks are heuristics rather than human judgments. Episode state is in memory and resets on server restart. It does not read or write the web app's SQLite chat.
