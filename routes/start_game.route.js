import express from "express";
import reportModel from "../models/report.model.js";
import parameterModel from "../models/parameter.model.js";

const enterGameRoute = express.Router();

enterGameRoute.post("/", async (req, res) => {
    const {report_id, game_id} = req.body;
    if (!game_id) {
        return res.status(400).send("Missing game_id or name");
    }
    let report;
    if (!report_id) {
        //create
        let lastPin = parseInt(await parameterModel.get("last_pin"))
        if (!lastPin) {
            lastPin = 100000
        }
        await parameterModel.set("last_pin", lastPin + 1)
        report = await reportModel.createReport(game_id, lastPin.toString(), 1)
    } else {
        //update
        report = await reportModel.updateStatus(report_id, 1)
    }

    if (!report) {
        return res.status(404).send("Start fail");
    }

    return res.status(200).json(report);
});

export default enterGameRoute;
