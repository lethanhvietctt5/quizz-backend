import db from "../utils/db.js";
import { v4 as uuidv4 } from "uuid";

const reportModel = {

  selectAllReports: async (author_id) => {
    const reports = await db("report")
                        .join('game', 'report.game_id', '=', 'game.game_id')
                        .where('game.author_id', author_id);
    for (let i=0; i < reports.length; i++){
      let report_id = reports[i].report_id;
      const count = await db("player").count('player_id as count').where('report_id', report_id);
      reports[i]["count_players"] = count[0]['count'];
    } 
    return reports;
  },
  countPlayer: async () => {
    const games = await db("player").where("game_id", game_id);
    if (games.length === 0) {
      return null;
    }
    return games[0];
  },
  findReportById: async (report_id) => {
    const report = (await db("report")
                        .join('game', 'report.game_id', '=', 'game.game_id')
                        .where('report.report_id', report_id))[0];
    const count_players = (await db("player").count('player_id as count').where('report_id', report_id))[0].count;
    report["count_players"] = count_players;
    const count_questions = (await db("question").count('question_id as count').where('game_id', report.game_id))[0].count;
    report["count_questions"] = count_questions;
    return report;
  },
  selectListPlayers: async (report_id) => {
    const players = await db("player").where('report_id', report_id);
    return players;
  },
  selectListQuestions: async (game_id) => {
    const players = await db("question").where('game_id', game_id);
    return players;
  },
};

export default reportModel;
