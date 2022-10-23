const User = require("../models/users");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ massage: "Error type:", err }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => res.status(500).send({ massage: "Error type:", err }));
};

module.exports.findUserbyId = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ massage: "Error type:", err }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Передан некорректный id");
      }
      if (err.name === "ValidationError") {
        throw new BadRequestError("Неверено задано одно из полей");
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Передан некорректный id");
      }
      if (err.name === "ValidationError") {
        throw new BadRequestError("Ошибка в ссылке на новый аватар");
      }
    });
};
