const User = require("../models/users");
const BadRequestError = require("../Errors/BadRequestError");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      res
        .status(500)
        .send({ massage: `Произошла ошибка ${err.name}: ${err.message} ` });
    });
};

module.exports.createUser = (req, res, next) => {
  User.create(req.body)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err._message})
      }
      res
        .status(500)
        .send({ message: `Произошла ошибка ${err.name}: ${err.message} ` });
    next(err)})
  .catch(next);
};

module.exports.findUserbyId = (req, res) => {
  User.findById(req.params.id)
    .orFail(res.status(404).send({ message: err._message}))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: err._message})
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err._message})
      }
      res
        .status(500)
        .send({ massage: `Произошла ошибка ${err.name}: ${err.message} ` });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(res.status(404).send({ message: err._message}))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: err._message})
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err._message})
      }
      res
        .status(500)
        .send({ massage: `Произошла ошибка ${err.name}: ${err.message} ` });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(res.status(404).send({ message: err._message}))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: err._message})
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err._message})
      }
      res
        .status(500)
        .send({ massage: `Произошла ошибка ${err.name}: ${err.message} ` });
    });
};
