# Python client and Gymnasium adapter

Install `requirements.txt`, start the backend at `http://localhost:3001`, then run `python check_env.py`. It calls Gymnasium's `check_env` against the live HTTP service and runs a successful greeting episode.

`client.py` stores the ID returned by `/env/reset` and passes it on subsequent state, action and stats calls. `task_agent.py` is a hand-written rule-based baseline. `teams_env.py` exposes a 16-value observation and 12 discrete actions with Gymnasium's `reset` and `step` return shapes. The observation contains channel, task, progress and recent-message counts. `reset(seed=...)` passes the seed to the simulator. The `info` object omits random episode IDs so same-seed transitions are comparable.

This adapter is an interface for experiments. The repository does not include a trained policy, a reward benchmark, or evidence of learning. The simulator is separate from the web chat's SQLite data.
