import express from 'express';
import gameModel from '../models/game.model.js';
import reportModel from '../models/report.model.js';

const userRouter = express.Router();

userRouter.get('/:user_id/games', async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).send('Missing author_id');
  }

  const games = await gameModel.findGamesByAuthor(user_id);

  return res.status(200).json(games);
});

userRouter.get('/:user_id/reports', async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).send('Missing user_id');
  }
  const reports = await reportModel.selectAllReports(user_id);

  return res.status(200).json(reports);
});

export default userRouter;
