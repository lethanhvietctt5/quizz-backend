import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';
import randomstring from 'randomstring';
import userModel from '../models/user.model.js';

const authRoute = express.Router();

authRoute.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: 'email is required.' });
  if (!password) return res.status(400).json({ message: 'password is required.' });

  const user = await userModel.findUserByEmail(email);

  if (user == null) {
    return res.status(401).json({ message: 'Invalid email.' });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Password is wrong.' });
  }

  const access_token = jwt.sign(user, 'SECRET_KEY', {
    expiresIn: '7d',
  });

  const refresh_token = randomstring.generate(100);

  await userModel.updateUser(user.user_id, 'rf_token', refresh_token);

  return res.status(200).json({
    user: {
      ...user,
      password: undefined,
      rf_token: undefined,
    },
    access_token,
    refresh_token,
  });
});

authRoute.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(400).json({
      message: 'refreshToken is required.',
    });

  const user = await userModel.findUserByRfToken(refreshToken);

  if (!user)
    return res.status(400).json({
      message: 'Invalid refreshToken.',
    });

  const accessToken = jwt.sign(user, 'SECRET_KEY', {
    expiresIn: '7d',
  });

  return res.status(200).json({
    access_token: accessToken,
  });
});

export default authRoute;
