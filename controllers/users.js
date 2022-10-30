const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const errorNotFaund = require('../errors/errorNotFaund');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      res
        .status(500)
        .send({ message: `Произошла ошибка ${err.name}: ${err.message} ` });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
        return;
      }
      next(err);
    })
    .catch(next);
};

module.exports.findUserbyId = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw errorNotFaund;
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка. Проверте правильность id' });
        return;
      }
      if (err.statusCode === 404) {
        res.status(404).send({ message: 'Пользователь с таким id не найден' });
        return;
      }
      next(err);
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw errorNotFaund;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка. Проверте правильность id' });
        return;
      }
      next(err);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
        return;
      }
      next(err);
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: err.message });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
        return;
      }
      next(err);
    })
    .catch(next);
};

// module.exports.createUser = (req, res) => {
//   bcrypt
//     .hash(req.body.password, 10)
//     .then((hash) => User.create({
//       email: req.body.email,
//       password: hash,
//     }))
//     .then((user) => {
//       res.status(201).send({
//         _id: user._id,
//         email: user.email,
//       });
//     })
//     .catch((err) => {
//       res.status(400).send(err);
//     });
// };
// токен хранится 7 дней
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.status(200).send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    })
    .catch(next);
};
