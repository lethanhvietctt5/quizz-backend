import cors from 'cors';
import express from 'express';

import { createServer } from 'http';
import { Server } from 'socket.io';
import playerModel from './models/player.model.js';
import questionModel from './models/question.model.js';
import authRoute from './routes/auth.route.js';
import gameRoute from './routes/game.route.js';
import questionRoute from './routes/question.route.js';
import registerRoute from './routes/register.route.js';
import reportRoute from './routes/report.route.js';
import enterGameRoute from './routes/start_game.route.js';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  transports: ['websocket', 'polling', 'flashsocket'],
  cors: {
    origin: '*',
    credentials: true,
  },
});

io.on('connection', socket => {
  socket.on('start_game', report_id => {
    socket.join(report_id);
  });

  socket.on('join_game', async ({ report_id, name }) => {
    const player = await playerModel.addPlayer(socket.id, report_id, name);
    socket.join(report_id);
    io.in(report_id).emit('new_player', player);
  });

  socket.on('play', report_id => {
    io.in(report_id).emit('play');
  });

  socket.on('answer', async ({ report_id, question_id, answer, count_time }) => {
    const question = await questionModel.findQuestionById(question_id);
    if (question.correct_ans.includes(answer)) {
      await playerModel.updateScore(socket.id, count_time * 100);
    }
    const players = await playerModel.getAllPlayer(report_id);
    io.in(report_id).emit('update_players', players);
  });

  socket.on('update_players', async report_id => {
    const players = await playerModel.getAllPlayer(report_id);
    io.in(report_id).emit('update_players', players);
  });

  socket.on('next', report_id => {
    io.in(report_id).emit('next_question');
  });
});

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
app.use('/api/question', questionRoute);
app.use('/api/report', reportRoute);
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
