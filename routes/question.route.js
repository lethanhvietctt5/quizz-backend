import express from 'express';
import questionModel from '../models/question.model.js';

const questionRoute = express.Router();

questionRoute.get('/:question_id', async (req, res) => {
  const { question_id } = req.params;
  if (!question_id) {
    return res.status(400).json({ message: 'Missing question_id' });
  }
  const question = await questionModel.findQuestionById(question_id);

  if (!question) {
    return res.status(404).json({ message: 'Question not found' });
  }

  return res.status(200).json(question);
});

questionRoute.post('/', async (req, res) => {
  const { question_id, game_id, content, ans_A, ans_B, ans_C, ans_D, correct_ans, duration_sec } = req.body;

  if (!question_id) return res.status(400).json({ message: 'Missing question_id' });
  if (!game_id) return res.status(400).json({ message: 'Missing game_id' });
  if (!content) return res.status(400).json({ message: 'Missing content' });
  if (!ans_A) return res.status(400).json({ message: 'Missing ans_A' });
  if (!ans_B) return res.status(400).json({ message: 'Missing ans_B' });
  if (!ans_C) return res.status(400).json({ message: 'Missing ans_C' });
  if (!ans_D) return res.status(400).json({ message: 'Missing ans_D' });
  if (!correct_ans) return res.status(400).json({ message: 'Missing correct_ans' });

  const question = await questionModel.findQuestionById(question_id);

  if (question) {
    try {
      await questionModel.updateQuestion(question_id, content, ans_A, ans_B, ans_C, ans_D, correct_ans, duration_sec);

      const question = await questionModel.findQuestionById(question_id);
      return res.status(200).json(question);
    } catch (err) {
      return res.status(500).json({ message: 'Error creating question' });
    }
  }

  try {
    const question = await questionModel.createQuestion(
      question_id,
      game_id,
      content,
      ans_A,
      ans_B,
      ans_C,
      ans_D,
      correct_ans,
      duration_sec,
    );
    return res.status(200).json(question);
  } catch (err) {
    return res.status(500).json({
      message: 'Error creating question',
    });
  }
});

questionRoute.patch('/:question_id', async (req, res) => {
  const { question_id } = req.params;
  if (!question_id) return res.status(400).json({ message: 'Missing question_id' });

  const { content, ans_A, ans_B, ans_C, ans_D, correct_ans, duration_sec } = req.body;

  if (!content) return res.status(400).json({ message: 'Missing content' });
  if (!ans_A) return res.status(400).json({ message: 'Missing ans_A' });
  if (!ans_B) return res.status(400).json({ message: 'Missing ans_B' });
  if (!ans_C) return res.status(400).json({ message: 'Missing ans_C' });
  if (!ans_D) return res.status(400).json({ message: 'Missing ans_D' });
  if (!correct_ans) return res.status(400).json({ message: 'Missing correct_ans' });

  try {
    const question = await questionModel.updateQuestion(
      question_id,
      content,
      ans_A,
      ans_B,
      ans_C,
      ans_D,
      correct_ans,
      duration_sec,
    );

    return res.status(200).json(question);
  } catch (err) {
    return res.status(500).json({ message: 'Error updating question' });
  }
});

questionRoute.delete('/:question_id', async (req, res) => {
  const { question_id } = req.params;
  if (!question_id) return res.status(400).json({ message: 'Missing question_id' });

  try {
    await questionModel.deleteQuestion(question_id);

    return res.status(200).json({ message: 'Question deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting question' });
  }
});

export default questionRoute;
