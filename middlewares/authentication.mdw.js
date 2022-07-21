import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
  const accessToken = req.headers['authorization'];

  if (!accessToken)
    return res.status(403).json({
      message: 'No access_token provided.',
    });

  jwt.verify(accessToken, 'SECRET_KEY', function (err) {
    if (err) {
      return res.status(401).json({
        message: 'Unauthorized access.',
      });
    }

    next();
  });
}

export default authMiddleware;
