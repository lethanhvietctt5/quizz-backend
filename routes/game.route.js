import express from "express";
import gameModel from "../models/game.model.js";
import userModel from "../models/user.model.js";

const gameRoute = express.Router();

gameRoute.get("/:game_id", async (req, res) => {
  const { game_id } = req.params;

  if (!game_id) {
    res.status(400).send("Missing game_id");
    return;
  }

  const game = await gameModel.findGameById(game_id);

  if (!game) {
    return res.status(404).send("Game not found");
  }

  return res.status(200).json(game);
});

gameRoute.get("/all_games/:author_id", async (req, res) => {
  const { author_id } = req.params;

  if (!author_id) {
    return res.status(400).send("Missing author_id");
  }

  const games = await gameModel.findGamesByAuthor(author_id);

  return res.status(200).json(games);
});

gameRoute.get("/getQuestions/:game_id", async (req, res) => {
  const { game_id } = req.params;
  if (!game_id) {
    return res.status(400).json({ message: "game_id is required." });
  }

  const questions = await gameModel.getAllQuestions(game_id);

  return res.status(200).json(questions);
});

gameRoute.get("/gameByReport/:report_id", async (req, res) => {
  const { report_id } = req.params;

  if (!report_id) {
    return res.status(400).json({ message: "Invalid report_id." });
  }

  const game = await gameModel.findGameByReportId(report_id);

  if (game) return res.status(200).json(game);
  return res.status(400).json({ message: "Not found any game match." });
});

gameRoute.post("/", async (req, res) => {
  const { author_id, name } = req.body;

  if (!author_id || !name) {
    return res.status(400).send("Missing author_id or name");
  }

  const author = await userModel.findUserById(author_id);

  if (!author) {
    return res.status(404).send("Author not found");
  }

  const game = await gameModel.createGame(author_id, name);

  return res.status(200).json(game);
});

gameRoute.patch("/:game_id", async (req, res) => {
  const { name } = req.body;
  const { game_id } = req.params;

  if (!game_id || !name) {
    res.status(400).send("Missing game_id or name");
    return;
  }

  await gameModel.updateGame(game_id, name);
  const game = await gameModel.findGameById(game_id);

  if (!game) {
    return res.status(404).send("Game not found");
  }

  return res.status(200).json(game);
});

export default gameRoute;
