import express from "express";
import morgan from "morgan";
import cors from "cors";

import registerRoute from "./routes/register.route.js";
import authRoute from "./routes/auth.route.js";
import gameRoute from "./routes/game.route.js";
import questionRoute from "./routes/question.route.js";
import {createServer} from "http";
import {Server} from "socket.io";
import enterGameRoute from "./routes/start_game.route.js";
import ReportModel from "./models/report.model.js";
import playerModel from "./models/player.model.js";
import questionModel from "./models/question.model.js";

const app = express();
const httpServer = createServer(app);


const io = new Server(httpServer, {
    transports: ['websocket', 'polling', 'flashsocket'],
    cors: {
        origin: "*",
        credentials: true
    }
});

io.on("connection", (socket) => {
    let report;
    let userType = "user";
    socket.on("user_type", (type) => {
        userType = type  //type: host | user
    })

    socket.on("join", async (pin) => {
            report = await ReportModel.findReportByPin(pin)
            // console.log(socket.id);
            if (!!report) {
                socket.join(pin);
                socket.emit("join_success")
            }
    })

    //user

    socket.on("enter_name", (name) => {
        if (userType === "user") {
            console.log("enter_name " + name)
            if (!!report) {
                playerModel.addPlayer(socket.id, report.report_id, name).then(player => {
                    socket.emit("waiting")
                    playerModel.getAllPlayer(report.report_id).then(players =>
                        socket.to(report.pin_code).emit("new_list_player", players)
                    )
                })
            }
        }
        //add db
    })
    //host

    socket.on("start_game",()=>{
        questionModel.findQuestionsByGameId(report.game_id).then(quests=>{
            socket.to(report.pin_code).emit("questions", players)
        })
    })
});


app.use(express.json());
app.use(morgan("dev"));
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE"],
    })
);

app.use("/api/register", registerRoute);
app.use("/api/auth", authRoute);
app.use("/api/game", gameRoute);
app.use("/api/question", questionRoute);
app.use("/api/start_game", enterGameRoute);

app.use(function (req, res) {
    res.status(404).json({
        error: "Endpoint not found.",
    });
});

app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500).json({
        error: "Something wrong!",
    });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, function () {
    console.log(`Quizz API is listening at http://localhost:${PORT}`);
});
