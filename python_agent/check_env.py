"""Verify the live API adapter and one successful episode."""

from gymnasium.utils.env_checker import check_env

from teams_env import TeamsEnv


def main():
    env = TeamsEnv()
    check_env(env)
    observation, _ = env.reset(seed=7)
    assert env.observation_space.contains(observation)
    _, reward, terminated, truncated, _ = env.step(0)
    assert terminated and not truncated and reward > 0
    print("Gymnasium adapter and greeting episode passed")


if __name__ == "__main__":
    main()
