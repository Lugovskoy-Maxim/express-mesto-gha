const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');
// const handleAuthError = (res) => {
//   res.status(401).send({ message: 'Необходима авторизация' });
// };

// const extractBearerToken = (header) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    throw new AuthError('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
