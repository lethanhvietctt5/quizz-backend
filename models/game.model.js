import db from "../utils/db.js";
import { v4 as uuidv4 } from "uuid";

const gameModel = {
  findGameById: async (game_id) => {
    const games = await db("game").where("game_id", game_id);

    if (games.length === 0) {
      return null;
    }
    return games[0];
  },

  findGamesByAuthor: async (author_id) => {
    const games = await db("game").where("author_id", author_id);
    return games;
  },

  createGame: async (author_id, name) => {
    const entity = {
      game_id: uuidv4(),
      author_id,
      name,
    };

    await db("game").insert(entity);
    const newgame = await db("game").where("game_id", entity.game_id);

    return newgame[0];
  },

  updateGame: async (game_id, name) => {
    const game = await db("game").where("game_id", game_id);
    if (game.length === 0) {
      return null;
    }

    const gameUpdated = await db("game")
      .where("game_id", game_id)
      .update({ name });

    if (gameUpdated) {
      return gameUpdated;
    } else {
      return null;
    }
  },
};

export default gameModel;
