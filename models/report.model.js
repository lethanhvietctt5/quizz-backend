import db from "../utils/db.js";
import {v4 as uuidv4} from "uuid";

const reportModel = {

    getAllReport: async (author_id) => {
        const reports = await db.select('report_id', 'game_id', 'pin_code', 'started_at').from('report')
            .innerJoin('game', 'report.game_id', 'game.game_id')
            .where("author_id", author_id);
        if (reports.length === 0) {
            return null;
        }
        return reports;
    },

    createReport: async (game_id, pin_code, status) => {
        const entity = {
            report_id: uuidv4(),
            game_id,
            pin_code,
            status,
        };

        await db("report").insert(entity);
        const newReport = await db("report").where("report_id", entity.report_id);

        return newReport[0];
    },

    findReportByPin: async (pin) => {
        const report = await db("report").where("pin_code", pin);
        if (report.length === 0) {
            return null;
        }
        return report[0];
    },
    updateStatus: async (report_id, status) => {
        const report = await db("report").where("report_id", report_id);
        if (report.length === 0) {
            return null;
        }
        const reportUpdated = await db("report")
            .where("report_id", report_id)
            .update({ status });

        if (reportUpdated) {
            return reportUpdated;
        } else {
            return null;
        }
    },
};

export default reportModel;
