import express from "express";
import { environment } from "../models/environment.js";

const router = express.Router();

/**
 * POST /env/reset
 * Reset the environment to initial state and start a new episode
 * Body: { episodeId?: string, taskType?: string }
 */
router.post("/reset", (req, res) => {
  try {
    const config = req.body || {};
    const result = environment.reset(config);
    res.json({
      success: true,
      ...result,
      message: "Environment reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /env/state
 * Get current environment state (observation)
 */
router.get("/state", (req, res) => {
  try {
    const state = environment.getState();
    res.json({
      success: true,
      state,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /env/step
 * Execute an action and get next state + reward
 * Body: { action: { type: string, payload: object }, episodeId?: string }
 */
router.post("/step", (req, res) => {
  try {
    const { action, episodeId } = req.body;

    if (!action || !action.type) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid action format. Expected: { action: { type: string, payload: object } }",
      });
    }

    const result = environment.step(action, episodeId);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /env/actions
 * Get list of available actions
 */
router.get("/actions", (req, res) => {
  try {
    const actions = environment.getAvailableActions();
    res.json({
      success: true,
      ...actions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /env/stats
 * Get episode statistics
 */
router.get("/stats", (req, res) => {
  try {
    const { episodeId } = req.query;
    const state = environment.getState(episodeId);
    res.json({
      success: true,
      stats: state.stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /env/info/:episodeId
 * Get detailed information about a specific episode
 */
router.get("/info/:episodeId", (req, res) => {
  try {
    const { episodeId } = req.params;
    const info = environment.getEpisodeInfo(episodeId);

    if (!info) {
      return res.status(404).json({
        success: false,
        error: "Episode not found",
      });
    }

    res.json({
      success: true,
      episode: info,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /env/history
 * Get episode history
 */
router.get("/history", (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const history = environment.getHistory(limit);

    res.json({
      success: true,
      history,
      count: history.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /env/tasks
 * Get all available tasks
 */
router.get("/tasks", (req, res) => {
  try {
    const tasksArray = environment.getTasks();

    // Convert array to object with type as key for easier access
    const tasks = {};
    tasksArray.forEach((task) => {
      tasks[task.type] = task;
    });

    res.json({
      success: true,
      tasks,
      count: tasksArray.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
