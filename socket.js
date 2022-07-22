import playerModel from './models/player.model.js';
import questionModel from './models/question.model.js';
import reportModel from './models/report.model.js';

export default function socketFunc(io) {
  io.on('connection', socket => {
    socket.on('start_game', async report_id => {
      socket.join(report_id);
      await reportModel.updateSocketId(report_id, socket.id);
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
      if (answer && answer.length > 0 && question.correct_ans.includes(answer)) {
        await playerModel.updateScore(socket.id, count_time * 100);
      }
      const players = await playerModel.getAllPlayer(report_id);
      io.in(report_id).emit('update_players', players);
    });

    socket.on('update_players', async report_id => {
      let players = await playerModel.getAllPlayer(report_id);
      if (players) {
        players = players.filter(player => player.status == 1);
        io.in(report_id).emit('update_players', players);
      }
    });

    socket.on('next', report_id => {
      io.in(report_id).emit('next_question');
    });

    socket.on('end_game', async report_id => {
      await reportModel.updateStatus(report_id, 0);
    });

    socket.on('disconnect', async () => {
      const report = await reportModel.findReportBySocketId(socket.id);

      await playerModel.updateStatusPlayer(socket.id, 0);

      if (report) {
        await reportModel.updateStatus(report.report_id, 0);
        io.in(report.report_id).emit('end_game');
      }

      const players = await playerModel.findByPlayerId(socket.id);
      if (players) {
        for (let idx = 0; idx < players.length; idx++) {
          io.in(players[idx].report_id).emit('player_leave', socket.id);
        }
      }
    });
  });
}
