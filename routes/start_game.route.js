import express from 'express';
import reportModel from '../models/report.model.js';

const enterGameRoute = express.Router();

enterGameRoute.post('/', async (req, res) => {
  const { game_id } = req.body;

  if (!game_id) {
    return res.status(400).send('Missing game_id or name');
  }

  let pin = '';

  for (let i = 0; i < 7; i++) {
    pin = pin + Math.floor(Math.random() * 9);
  }

  let report = await reportModel.createReport(game_id, pin, 1);

  if (!report) {
    return res.status(404).send('Start fail');
  }

  return res.status(200).json(report);
});

export default enterGameRoute;
