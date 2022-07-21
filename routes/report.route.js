import express from 'express';
import gameModel from '../models/game.model.js';
import reportModel from '../models/report.model.js';

const reportRoute = express.Router();

reportRoute.get('/:report_id/game', async (req, res) => {
  const { report_id } = req.params;

  if (!report_id) {
    return res.status(400).json({ message: 'Invalid report_id.' });
  }

  const game = await gameModel.findGameByReportId(report_id);

  if (game) return res.status(200).json(game);
  return res.status(400).json({ message: 'Not found any game match.' });
});

reportRoute.get('/:report_id/players', async (req, res) => {
  const { report_id } = req.params;
  if (!report_id) {
    return res.status(400).send('Missing report_id');
  }
  const players = await reportModel.selectListPlayers(report_id);

  return res.status(200).json(players);
});

reportRoute.get('/:report_id', async (req, res) => {
  const { report_id } = req.params;

  if (!report_id) {
    res.status(400).send('Missing report_id');
    return;
  }

  const report = await reportModel.findReportById(report_id);

  if (!report) {
    return res.status(404).send('report not found');
  }

  return res.status(200).json(report);
});

reportRoute.get('/reportByPin/:pin', async (req, res) => {
  const { pin } = req.params;

  if (!pin) {
    return res.status(400).json({ message: 'Pin code is invalid.' });
  }

  const report = await reportModel.findReportByPin(pin);
  return res.status(200).json(report);
});

export default reportRoute;
