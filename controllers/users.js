const User = require("../models/users");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      res
        .status(500)
        .send({ massage:`${err.name}: ${err.message} `});
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({ massage:`${err.name}: ${err.message} ` });
        return;
      }
      res
        .status(500).send({ massage:`${err.name}: ${err.message} ` });
    });
};

module.exports.findUserbyId = (req, res) => {
  User.findById(req.params.id)
    .orFail(res.status(400).send("Пользователь по указанному id не найден"))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send("Передан некорректный id");
        return;
      }
      if (err.name === "ValidationError") {
        res.status(400).send("Неверено задано одно из полей");
        return;
      }
      res
        .status(500)
        .send({ massage:`${err.name}: ${err.message} ` });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(new NotFoundError("Пользователь по указанному id не найден"))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send("Передан некорректный id");
        return;
      }
      if (err.name === "ValidationError") {
        res.status(400).send("Неверено задано одно из полей");
        return;
      }
      res
        .status(500)
        .send({ massage:`${err.name}: ${err.message} ` });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(new NotFoundError("Пользователь по указанному id не найден"))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send("Передан некорректный id");
        return;
      }
      if (err.name === "ValidationError") {
        res.status(400).send("Неверено задано одно из полей");
        return;
      }
      res
        .status(500)
        .send({ massage:`${err.name}: ${err.message} ` });
    });
};
