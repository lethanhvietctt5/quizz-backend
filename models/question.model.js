import db from '../utils/db.js';

const questionModel = {
  findQuestionById: async question_id => {
    const questions = await db('question').where('question_id', question_id);

    if (questions.length === 0) {
      return null;
    }
    return questions[0];
  },

  findQuestionsByGameId: async game_id => {
    const questions = await db('question').where('game_id', game_id);
    return questions;
  },

  createQuestion: async (question_id, game_id, content, ans_A, ans_B, ans_C, ans_D, correct_ans, duration_sec) => {
    const entity = {
      question_id,
      game_id,
      content,
      ans_A,
      ans_B,
      ans_C,
      ans_D,
      correct_ans,
      duration_sec,
    };

    await db('question').insert(entity);
    const newquestion = await db('question').where('question_id', entity.question_id);

    return newquestion[0];
  },

  updateQuestion: async (question_id, content, ans_A, ans_B, ans_C, ans_D, correct_ans, duration_sec) => {
    const question = await db('question').where('question_id', question_id);
    if (question.length === 0) {
      return null;
    }

    const questionUpdated = await db('question').where('question_id', question_id).update({
      content,
      ans_A,
      ans_B,
      ans_C,
      ans_D,
      correct_ans,
      duration_sec,
    });

    if (questionUpdated) {
      return questionUpdated;
    } else {
      return null;
    }
  },

  deleteQuestion: async question_id => {
    return await db('question').where('question_id', question_id).del();
  },
};

export default questionModel;
