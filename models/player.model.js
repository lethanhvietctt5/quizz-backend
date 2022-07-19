import db from '../utils/db.js';

const playerModel = {
  getAllPlayer: async report_id => {
    const reports = await db('player').where('report_id', report_id);
    if (reports.length === 0) {
      return null;
    }
    return reports;
  },

  addPlayer: async (player_id, report_id, name) => {
    const entity = {
      player_id,
      name,
      report_id,
    };

    await db('player').insert(entity);
    const newPlayer = await db('player').where('player_id', entity.player_id);

    return newPlayer[0];
  },

  updateScore: async (player_id, score) => {
    const players = await db('player').where('player_id', player_id);
    if (players.length === 0) {
      return null;
    }
    const playerUpdated = await db('player')
      .where('player_id', player_id)
      .update({
        correct_count: players[0].correct_count + 1,
        score: players[0].score + score,
      });

    if (playerUpdated) {
      return playerUpdated;
    } else {
      return null;
    }
  },
};

export default playerModel;
