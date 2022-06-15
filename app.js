import express from "express";
import morgan from "morgan";
import cors from "cors";

import registerRoute from "./routes/register.route.js";
import authRoute from "./routes/auth.route.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  })
);

app.use("/api/register", registerRoute);
app.use("/api/auth", authRoute);

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
app.listen(PORT, function () {
  console.log(`Quizz API is listening at http://localhost:${PORT}`);
});
