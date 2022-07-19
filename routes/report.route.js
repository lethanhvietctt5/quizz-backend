import express from "express";
import reportModel from "../models/report.model.js";

const reportRoute = express.Router();

reportRoute.get("/:report_id", async (req, res) => {
  const { report_id } = req.params;

  if (!report_id) {
    res.status(400).send("Missing report_id");
    return;
  }

  const report = await reportModel.findReportById(report_id);

  if (!report) {
    return res.status(404).send("report not found");
  }

  return res.status(200).json(report);
});

reportRoute.get("/all_reports/:report_id", async (req, res) => {
  const { report_id } = req.params;
  if (!report_id) {
    return res.status(400).send("Missing report_id");
  }
  const reports = await reportModel.selectAllReports(report_id);

  return res.status(200).json(reports);
});

reportRoute.get("/list_players/:report_id", async (req, res) => {
  const { report_id } = req.params;
  if (!report_id) {
    return res.status(400).send("Missing report_id");
  }
  const players = await reportModel.selectListPlayers(report_id);

  return res.status(200).json(players);
});

reportRoute.get("/list_questions/:game_id", async (req, res) => {
  const { game_id } = req.params;
  if (!game_id) {
    return res.status(400).send("Missing game_id");
  }
  const questions = await reportModel.selectListQuestions(game_id);

  return res.status(200).json(questions);
});

reportRoute.get("/reportByPin/:pin", async (req, res) => {
  const { pin } = req.params;

  if (!pin) {
    return res.status(400).json({ message: "Pin code is invalid." });
  }

  const report = await reportModel.findReportByPin(pin);
  return res.status(200).json(report);
});

export default reportRoute;
