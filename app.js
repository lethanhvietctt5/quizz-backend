import cors from 'cors';
import express from 'express';

import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoute from './routes/auth.route.js';
import gameRoute from './routes/game.route.js';
import questionRoute from './routes/question.route.js';
import registerRoute from './routes/register.route.js';
import reportRoute from './routes/report.route.js';
import enterGameRoute from './routes/start_game.route.js';
import userRoute from './routes/user.route.js';

import authMiddleware from './middlewares/authentication.mdw.js';
import socketFunc from './socket.js';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  transports: ['websocket', 'polling', 'flashsocket'],
  cors: {
    origin: '*',
    credentials: true,
  },
});

socketFunc(io);

app.use(express.json());
// app.use(morgan('dev'));
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  }),
);

app.use('/api/register', registerRoute);
app.use('/api/auth', authRoute);
app.use('/api/game', gameRoute);
app.use('/api/report', reportRoute);

app.use(authMiddleware);
app.use('/api/question', questionRoute);
app.use('/api/user', userRoute);
app.use('/api/start_game', enterGameRoute);

app.use(function (req, res) {
  res.status(404).json({
    error: 'Endpoint not found.',
  });
});

app.use(function (err, req, res) {
  console.log(err.stack);
  res.status(500).json({
    error: 'Something wrong!',
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, function () {
  console.log(`Quizz API is listening at http://localhost:${PORT}`);
});
