const User = require("../models/users");

module.exports.getUsers = (req, res) => {
  User.find({})
  .then((user) => res.send({ data: user }))
  .catch(err => res.status(500).send({massage : 'Error type:', err}))
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
  .then((user) => {
    res.status(200).send(user)
  })
  .catch((err) =>
  res.status(500).send({massage : 'Error type:', err}))
};

module.exports.findUserbyId = (req, res) => {
  User.findById(req.params.id)
  .then((user) => res.send({ data: user }))
  .catch(err => res.status(500).send({massage : 'Error type:', err}))
};