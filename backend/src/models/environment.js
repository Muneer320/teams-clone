import { v4 as uuidv4 } from "uuid";

/**
 * RL Environment State Management
 * Manages teams, channels, messages, and agent state
 * Supports multiple episodes, task-based goals, and sophisticated reward structures
 */
class Environment {
  constructor() {
    this.episodes = new Map(); // episodeId -> episode data
    this.currentEpisodeId = null;
    this.episodeHistory = []; // completed episodes
    this.taskDefinitions = this.initializeTaskDefinitions();
  }

  /**
   * Initialize available task definitions
   */
  initializeTaskDefinitions() {
    return {
      greeting_response: {
        name: "Greeting Response",
        description: "Respond to a greeting message within 5 steps",
        checkCompletion: (episode) => {
          const hasGreeting = episode.messages["channel-1"]?.some(
            (msg) =>
              msg.userId !== "agent" &&
              (msg.content.toLowerCase().includes("hello") ||
                msg.content.toLowerCase().includes("hi") ||
                msg.content.toLowerCase().includes("welcome"))
          );
          const hasResponse = episode.messages["channel-1"]?.some(
            (msg) => msg.userId === "agent" && episode.stats.stepCount <= 5
          );
          return hasGreeting && hasResponse;
        },
        reward: 2.0,
        maxSteps: 10,
      },
      channel_explorer: {
        name: "Channel Explorer",
        description: "Visit at least 3 different channels",
        checkCompletion: (episode) => {
          return episode.stats.channelsSwitched >= 3;
        },
        reward: 1.5,
        maxSteps: 20,
      },
      active_participant: {
        name: "Active Participant",
        description: "Send at least 5 relevant messages",
        checkCompletion: (episode) => {
          return episode.stats.messagesSent >= 5;
        },
        reward: 2.5,
        maxSteps: 30,
      },
      meeting_joiner: {
        name: "Meeting Joiner",
        description: "Join a call when invited",
        checkCompletion: (episode) => {
          return episode.stats.callsJoined >= 1;
        },
        reward: 3.0,
        maxSteps: 15,
      },
      social_butterfly: {
        name: "Social Butterfly",
        description: "React to at least 3 messages and send 3 messages",
        checkCompletion: (episode) => {
          return (
            episode.stats.reactionsGiven >= 3 && episode.stats.messagesSent >= 3
          );
        },
        reward: 2.0,
        maxSteps: 25,
      },
    };
  }

  /**
   * Select a random task for the episode
   */
  selectRandomTask() {
    const taskTypes = Object.keys(this.taskDefinitions);
    return taskTypes[Math.floor(Math.random() * taskTypes.length)];
  }

  /**
   * Reset environment and start new episode
   */
  reset(config = {}) {
    const episodeId = config.episodeId || uuidv4();
    const taskType = config.taskType || this.selectRandomTask();

    const episode = {
      id: episodeId,
      task: this.taskDefinitions[taskType],
      taskType,
      startTime: Date.now(),
      endTime: null,
      teams: [
        {
          id: "team-1",
          name: "General Team",
          channels: [
            { id: "channel-1", name: "General", teamId: "team-1", unread: 0 },
            { id: "channel-2", name: "Random", teamId: "team-1", unread: 0 },
            {
              id: "channel-3",
              name: "Announcements",
              teamId: "team-1",
              unread: 0,
            },
          ],
        },
        {
          id: "team-2",
          name: "Project Alpha",
          channels: [
            {
              id: "channel-4",
              name: "Development",
              teamId: "team-2",
              unread: 0,
            },
            { id: "channel-5", name: "Design", teamId: "team-2", unread: 0 },
          ],
        },
      ],
      messages: {},
      users: [
        { id: "user-1", name: "Alice", status: "available", avatar: "👩" },
        { id: "user-2", name: "Bob", status: "busy", avatar: "👨" },
        { id: "user-3", name: "Charlie", status: "away", avatar: "🧑" },
        { id: "agent", name: "RL Agent", status: "available", avatar: "🤖" },
      ],
      agentState: {
        currentTeamId: "team-1",
        currentChannelId: "channel-1",
        userId: "agent",
      },
      stats: {
        stepCount: 0,
        totalReward: 0,
        messagesSent: 0,
        channelsSwitched: 0,
        reactionsGiven: 0,
        callsJoined: 0,
        invalidActions: 0,
        taskCompleted: false,
        startTime: Date.now(),
      },
      actionHistory: [],
      done: false,
    };

    // Initialize message arrays for each channel
    episode.teams.forEach((team) => {
      team.channels.forEach((channel) => {
        episode.messages[channel.id] = [];
      });
    });

    // Add initial contextual messages based on task
    this.initializeTaskContext(episode);

    this.episodes.set(episodeId, episode);
    this.currentEpisodeId = episodeId;

    return {
      episodeId,
      state: this.getState(episodeId),
      task: {
        type: taskType,
        name: episode.task.name,
        description: episode.task.description,
        maxSteps: episode.task.maxSteps,
      },
    };
  }

  /**
   * Initialize messages based on the task type
   */
  initializeTaskContext(episode) {
    switch (episode.taskType) {
      case "greeting_response":
        this.addMessageToEpisode(
          episode,
          "channel-1",
          "user-1",
          "Hello! Welcome to the team! 👋"
        );
        this.addMessageToEpisode(
          episode,
          "channel-1",
          "user-2",
          "Hey there! How's everyone doing?"
        );
        break;

      case "channel_explorer":
        this.addMessageToEpisode(
          episode,
          "channel-1",
          "user-1",
          "Check out the other channels!"
        );
        this.addMessageToEpisode(
          episode,
          "channel-2",
          "user-3",
          "Anyone up for lunch?"
        );
        this.addMessageToEpisode(
          episode,
          "channel-4",
          "user-2",
          "Dev team sync at 3pm"
        );
        break;

      case "active_participant":
        this.addMessageToEpisode(
          episode,
          "channel-1",
          "user-1",
          "What's everyone working on today?"
        );
        this.addMessageToEpisode(
          episode,
          "channel-1",
          "user-2",
          "I'm finishing up the API docs"
        );
        break;

      case "meeting_joiner":
        this.addMessageToEpisode(
          episode,
          "channel-1",
          "user-1",
          "@agent Hey! We're having a quick standup, want to join?"
        );
        break;

      case "social_butterfly":
        this.addMessageToEpisode(
          episode,
          "channel-1",
          "user-1",
          "Great work on the project! 🎉"
        );
        this.addMessageToEpisode(
          episode,
          "channel-1",
          "user-2",
          "Thanks! Couldn't have done it without the team"
        );
        this.addMessageToEpisode(
          episode,
          "channel-2",
          "user-3",
          "Pizza party tomorrow! 🍕"
        );
        break;

      default:
        this.addMessageToEpisode(
          episode,
          "channel-1",
          "user-1",
          "Welcome to the team! 👋"
        );
    }
  }

  /**
   * Get current environment state (observation)
   */
  getState(episodeId = null) {
    const id = episodeId || this.currentEpisodeId;
    const episode = this.episodes.get(id);

    if (!episode) {
      throw new Error("No active episode found");
    }

    const currentChannel = this.getCurrentChannel(episode);
    const recentMessages =
      episode.messages[episode.agentState.currentChannelId].slice(-10);

    return {
      episodeId: episode.id,
      agentState: { ...episode.agentState },
      currentChannel,
      recentMessages,
      teams: episode.teams,
      users: episode.users,
      stats: { ...episode.stats },
      task: {
        type: episode.taskType,
        name: episode.task.name,
        description: episode.task.description,
        maxSteps: episode.task.maxSteps,
        completed: episode.stats.taskCompleted,
      },
      timestamp: Date.now(),
    };
  }

  /**
   * Get current channel for an episode
   */
  getCurrentChannel(episode) {
    for (const team of episode.teams) {
      const channel = team.channels.find(
        (ch) => ch.id === episode.agentState.currentChannelId
      );
      if (channel) return channel;
    }
    return null;
  }

  /**
   * Execute an action and return new state + reward
   */
  step(action, episodeId = null) {
    const id = episodeId || this.currentEpisodeId;
    const episode = this.episodes.get(id);

    if (!episode) {
      throw new Error("No active episode found");
    }

    if (episode.done) {
      return {
        state: this.getState(id),
        reward: 0,
        done: true,
        info: { error: "Episode already completed" },
      };
    }

    episode.stats.stepCount++;
    let reward = 0;
    let info = {};

    // Record action in history
    episode.actionHistory.push({
      step: episode.stats.stepCount,
      action: { ...action },
      timestamp: Date.now(),
    });

    try {
      switch (action.type) {
        case "send_message":
          reward = this.actionSendMessage(episode, action.payload);
          info.action = "message_sent";
          break;

        case "switch_channel":
          reward = this.actionSwitchChannel(episode, action.payload);
          info.action = "channel_switched";
          break;

        case "react_to_message":
          reward = this.actionReactToMessage(episode, action.payload);
          info.action = "reacted";
          break;

        case "join_call":
          reward = this.actionJoinCall(episode, action.payload);
          info.action = "joined_call";
          break;

        case "set_status":
          reward = this.actionSetStatus(episode, action.payload);
          info.action = "status_changed";
          break;

        default:
          reward = -0.1;
          episode.stats.invalidActions++;
          info.action = "invalid";
          info.error = `Unknown action type: ${action.type}`;
      }
    } catch (error) {
      reward = -0.5;
      episode.stats.invalidActions++;
      info.error = error.message;
    }

    episode.stats.totalReward += reward;

    // Check task completion
    if (!episode.stats.taskCompleted && episode.task.checkCompletion(episode)) {
      episode.stats.taskCompleted = true;
      reward += episode.task.reward;
      episode.stats.totalReward += episode.task.reward;
      info.taskCompleted = true;
      info.taskReward = episode.task.reward;
    }

    // Episode termination conditions
    episode.done = this.checkEpisodeDone(episode, info);

    if (episode.done) {
      episode.endTime = Date.now();
      this.episodeHistory.push({
        id: episode.id,
        taskType: episode.taskType,
        completed: episode.stats.taskCompleted,
        totalReward: episode.stats.totalReward,
        steps: episode.stats.stepCount,
        duration: episode.endTime - episode.startTime,
      });
    }

    const state = this.getState(id);
    return { state, reward, done: episode.done, info };
  }

  /**
   * Check if episode should terminate
   */
  checkEpisodeDone(episode, info) {
    // Task completed
    if (episode.stats.taskCompleted) {
      info.reason = "task_completed";
      return true;
    }

    // Max steps reached
    if (episode.stats.stepCount >= episode.task.maxSteps) {
      info.reason = "max_steps_reached";
      return true;
    }

    // Too many invalid actions
    if (episode.stats.invalidActions >= 5) {
      info.reason = "too_many_invalid_actions";
      return true;
    }

    return false;
  }

  /**
   * Action: Send a message
   */
  actionSendMessage(episode, payload) {
    const { content, channelId } = payload;
    const targetChannel = channelId || episode.agentState.currentChannelId;

    if (!content || content.trim().length === 0) {
      return -0.2; // Empty message penalty
    }

    if (content.length > 500) {
      return -0.1; // Too long message penalty
    }

    this.addMessageToEpisode(
      episode,
      targetChannel,
      episode.agentState.userId,
      content
    );
    episode.stats.messagesSent++;

    let reward = 0.1; // Base reward

    // Bonus for responding to mentions
    const recentMessages = episode.messages[targetChannel].slice(-5, -1); // Exclude just-sent message
    const hasMention = recentMessages.some(
      (msg) =>
        msg.content.includes("@agent") &&
        msg.userId !== episode.agentState.userId
    );
    if (hasMention) {
      reward += 0.5;
    }

    // Bonus for relevant keywords based on task
    if (episode.taskType === "greeting_response") {
      if (content.toLowerCase().match(/\b(hello|hi|hey|greetings)\b/)) {
        reward += 0.3;
      }
    }

    // Penalty for spam (repeated messages)
    const lastMessages = episode.messages[targetChannel].slice(-3);
    const isDuplicate =
      lastMessages.filter(
        (msg) => msg.userId === "agent" && msg.content === content
      ).length > 1;
    if (isDuplicate) {
      reward = -0.3;
    }

    return reward;
  }

  /**
   * Action: Switch channel
   */
  actionSwitchChannel(episode, payload) {
    const { channelId } = payload;

    if (!channelId) {
      return -0.2;
    }

    // Validate channel exists
    let channelExists = false;
    for (const team of episode.teams) {
      const channel = team.channels.find((ch) => ch.id === channelId);
      if (channel) {
        channelExists = true;
        episode.agentState.currentTeamId = team.id;
        // Clear unread for this channel
        channel.unread = 0;
        break;
      }
    }

    if (!channelExists) {
      return -0.3;
    }

    if (channelId === episode.agentState.currentChannelId) {
      return -0.1; // Already in this channel
    }

    episode.agentState.currentChannelId = channelId;
    episode.stats.channelsSwitched++;

    // Reward for exploring new channels
    return 0.05;
  }

  /**
   * Action: React to a message
   */
  actionReactToMessage(episode, payload) {
    const { messageId, reaction } = payload;

    if (!messageId || !reaction) {
      return -0.2;
    }

    // Find the message
    let messageFound = false;
    for (const channelId in episode.messages) {
      const message = episode.messages[channelId].find(
        (msg) => msg.id === messageId
      );
      if (message) {
        if (!message.reactions) {
          message.reactions = [];
        }
        message.reactions.push({
          userId: episode.agentState.userId,
          reaction,
          timestamp: Date.now(),
        });
        messageFound = true;
        episode.stats.reactionsGiven++;
        break;
      }
    }

    if (!messageFound) {
      return -0.2; // Message not found
    }

    return 0.05; // Small reward for engagement
  }

  /**
   * Action: Join a call
   */
  actionJoinCall(episode, payload) {
    const channelId = payload?.channelId || episode.agentState.currentChannelId;

    // Check if there's a call invitation
    const recentMessages = episode.messages[channelId].slice(-5);
    const hasCallInvitation = recentMessages.some(
      (msg) =>
        msg.content.includes("@agent") &&
        (msg.content.toLowerCase().includes("call") ||
          msg.content.toLowerCase().includes("meeting") ||
          msg.content.toLowerCase().includes("standup"))
    );

    episode.stats.callsJoined++;

    if (hasCallInvitation) {
      return 0.5; // Good reward for responding to invitation
    }

    return 0.1; // Small reward for joining anyway
  }

  /**
   * Action: Set agent status
   */
  actionSetStatus(episode, payload) {
    const { status } = payload;
    const validStatuses = ["available", "busy", "away", "dnd"];

    if (!validStatuses.includes(status)) {
      return -0.1;
    }

    const agent = episode.users.find((u) => u.id === episode.agentState.userId);
    if (agent) {
      agent.status = status;
    }

    return 0.02; // Small reward
  }

  /**
   * Add a message to episode
   */
  addMessageToEpisode(episode, channelId, userId, content) {
    const message = {
      id: uuidv4(),
      channelId,
      userId,
      content,
      timestamp: Date.now(),
      reactions: [],
    };

    if (!episode.messages[channelId]) {
      episode.messages[channelId] = [];
    }

    episode.messages[channelId].push(message);

    // Update unread count for other channels
    for (const team of episode.teams) {
      const channel = team.channels.find((ch) => ch.id === channelId);
      if (channel && channelId !== episode.agentState.currentChannelId) {
        channel.unread++;
      }
    }

    return message;
  }

  /**
   * Get available actions
   */
  getAvailableActions() {
    return {
      actions: [
        {
          type: "send_message",
          description: "Send a message to a channel",
          payload: {
            content: "string (required)",
            channelId: "string (optional, defaults to current channel)",
          },
          example: {
            type: "send_message",
            payload: { content: "Hello team!" },
          },
        },
        {
          type: "switch_channel",
          description: "Switch to a different channel",
          payload: {
            channelId: "string (required)",
          },
          example: {
            type: "switch_channel",
            payload: { channelId: "channel-2" },
          },
        },
        {
          type: "react_to_message",
          description: "React to a message with an emoji",
          payload: {
            messageId: "string (required)",
            reaction: "string (required)",
          },
          example: {
            type: "react_to_message",
            payload: { messageId: "msg-123", reaction: "👍" },
          },
        },
        {
          type: "join_call",
          description: "Join a call in a channel",
          payload: {
            channelId: "string (optional, defaults to current channel)",
          },
          example: {
            type: "join_call",
            payload: {},
          },
        },
        {
          type: "set_status",
          description: "Set agent status",
          payload: {
            status: "string (available, busy, away, dnd)",
          },
          example: {
            type: "set_status",
            payload: { status: "available" },
          },
        },
      ],
      channels:
        this.episodes.get(this.currentEpisodeId)?.teams.flatMap((team) =>
          team.channels.map((ch) => ({
            id: ch.id,
            name: ch.name,
            teamName: team.name,
          }))
        ) || [],
    };
  }

  /**
   * Get episode information
   */
  getEpisodeInfo(episodeId) {
    const episode = this.episodes.get(episodeId);
    if (!episode) {
      return null;
    }

    return {
      id: episode.id,
      taskType: episode.taskType,
      taskName: episode.task.name,
      taskDescription: episode.task.description,
      stats: episode.stats,
      done: episode.done,
      startTime: episode.startTime,
      endTime: episode.endTime,
      duration: episode.endTime
        ? episode.endTime - episode.startTime
        : Date.now() - episode.startTime,
    };
  }

  /**
   * Get episode history
   */
  getHistory(limit = 10) {
    return this.episodeHistory.slice(-limit);
  }

  /**
   * Get all task definitions
   */
  getTasks() {
    return Object.entries(this.taskDefinitions).map(([type, task]) => ({
      type,
      name: task.name,
      description: task.description,
      maxSteps: task.maxSteps,
      reward: task.reward,
    }));
  }
}

// Singleton instance
export const environment = new Environment();
export default Environment;
