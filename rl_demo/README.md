# CLI demonstration

Start the backend, then run `python rl_demo/run_demo.py --task greeting_response` from the repository root. Other choices are `channel_explorer`, `active_participant`, `meeting_joiner` and `social_butterfly`. Use `--url` to point at another locally running backend.

The script calls the API for each action and prints actual rewards and final stats. It uses `python_agent/task_agent.py`, a scripted policy. No sample results or precomputed plots are shipped.
