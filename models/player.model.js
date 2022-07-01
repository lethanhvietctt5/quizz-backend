import db from "../utils/db.js";
import {v4 as uuidv4} from "uuid";

const playerModel = {

    getAllPlayer: async (report_id) => {
        const reports = await db('player').where("report_id", report_id);
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

        await db("player").insert(entity);
        console.log("A")
        const newPlayer = await db("player").where("player_id", entity.player_id);
        console.log(newPlayer)


        return newPlayer[0];
    },

    // findReportByPin: async (pin) => {
    //     const report = await db("report").where("pin_code", pin);
    //     if (report.length === 0) {
    //         return null;
    //     }
    //     return report[0];
    // },
    updateScore: async (player_id,correct_count, score) => {
        const players = await db("player").where("player_id", player_id);
        if (players.length === 0) {
            return null;
        }
        const playerUpdated = await db("player")
            .where("player_id", player_id)
            .update({ correct_count, score});

        if (playerUpdated) {
            return playerUpdated;
        } else {
            return null;
        }
    },
};

export default playerModel;
