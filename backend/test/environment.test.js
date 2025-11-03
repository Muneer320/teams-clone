import test from "node:test";
import assert from "node:assert/strict";
import Environment from "../src/models/environment.js";

const step = (env, id, type, payload = {}) => env.step({ type, payload }, id);

test("unknown tasks and reused IDs are rejected", () => {
  const env = new Environment();
  assert.throws(() => env.reset({ taskType: "unknown" }), /Unknown task/);
  env.reset({ episodeId: "same", taskType: "greeting_response" });
  assert.throws(() => env.reset({ episodeId: "same" }), /already exists/);
});

test("gibberish does not complete greeting; real response does", () => {
  const env = new Environment();
  const { episodeId } = env.reset({ taskType: "greeting_response" });
  assert.equal(step(env, episodeId, "send_message", { content: "unrelated gibberish words" }).done, false);
  const result = step(env, episodeId, "send_message", { content: "Hello team, thanks for welcoming me!" });
  assert.equal(result.info.taskCompleted, true);
});

test("channel ping-pong does not count as exploration", () => {
  const env = new Environment();
  const { episodeId } = env.reset({ taskType: "channel_explorer" });
  step(env, episodeId, "switch_channel", { channelId: "channel-2" });
  step(env, episodeId, "switch_channel", { channelId: "channel-1" });
  assert.equal(env.getState(episodeId).stats.taskCompleted, false);
  assert.equal(step(env, episodeId, "switch_channel", { channelId: "channel-3" }).done, true);
});

test("short, repeated and irrelevant messages cannot finish participation", () => {
  const env = new Environment();
  const { episodeId } = env.reset({ taskType: "active_participant" });
  for (let i = 0; i < 3; i++) step(env, episodeId, "send_message", { content: i % 2 ? "b" : "a" });
  for (let i = 0; i < 3; i++) step(env, episodeId, "send_message", { content: "Our team is working on API docs" });
  assert.equal(env.getState(episodeId).stats.taskCompleted, false);
  for (let i = 0; i < 4; i++) {
    step(env, episodeId, "send_message", { content: `Our team has project update number ${i}` });
  }
  assert.equal(env.getState(episodeId).stats.taskCompleted, true);
});

test("a call requires an invitation in its channel", () => {
  const env = new Environment();
  const { episodeId } = env.reset({ taskType: "meeting_joiner" });
  assert.equal(step(env, episodeId, "join_call", { channelId: "channel-2" }).done, false);
  assert.equal(step(env, episodeId, "join_call", { channelId: "channel-1" }).done, true);
});

test("one reaction target and repeated messages cannot finish social task", () => {
  const env = new Environment();
  const { episodeId, state } = env.reset({ taskType: "social_butterfly" });
  const first = state.recentMessages[0].id;
  for (let i = 0; i < 3; i++) {
    step(env, episodeId, "react_to_message", { messageId: first, reaction: "👍" });
    step(env, episodeId, "send_message", { content: "Great work on the team project!" });
  }
  assert.equal(env.getState(episodeId).stats.taskCompleted, false);
  const second = state.recentMessages[1].id;
  step(env, episodeId, "react_to_message", { messageId: second, reaction: "👍" });
  step(env, episodeId, "switch_channel", { channelId: "channel-2" });
  const third = env.getState(episodeId).recentMessages[0].id;
  step(env, episodeId, "react_to_message", { messageId: third, reaction: "👍" });
  step(env, episodeId, "send_message", { content: "The project team is making progress" });
  assert.equal(step(env, episodeId, "send_message", { content: "Thanks for the team's great collaboration" }).done, true);
});

test("episode observations remain isolated", () => {
  const env = new Environment();
  const first = env.reset({ taskType: "channel_explorer" }).episodeId;
  const second = env.reset({ taskType: "channel_explorer" }).episodeId;
  step(env, first, "switch_channel", { channelId: "channel-2" });
  assert.equal(env.getState(first).agentState.currentChannelId, "channel-2");
  assert.equal(env.getState(second).agentState.currentChannelId, "channel-1");
});
