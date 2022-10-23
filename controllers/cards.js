const Card = require("../models/cards");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ massage: "Error type:", err }));
};

module.exports.createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send("Неверено задано одно из полей");
      }
      res
        .status(500)
        .send({ massage: `Произошла ошибка ${err.name}: ${err.message} ` });
    });
};

module.exports.removeCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card.owner.toString() == req.user._id) {
        card.remove().then(() => res.send({ message: "Карточка удалена" }));
        return;
      }
      res.status(500).send({ massage: `Невозможно удалить чужую карточку` });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ massage: `Переданы некорректные данные` });
        return;
      }
      {
        res
          .status(500)
          .send({ massage: `Произошла ошибка ${err.name}: ${err.message} ` });
      }
    });
};

module.exports.likeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .orFail(new NotFoundError("Карточка не найдена"))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send("Переданы некорректные данные");
        return;
      }
      {
        res
          .status(500)
          .send({ massage: `Произошла ошибка ${err.name}: ${err.message} ` });
      }
    });

module.exports.dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .orFail(res.status(400).send("Карточка не найдена"))
    .catch((err) => {
      res
        .status(500)
        .send({ massage: `Произошла ошибка ${err.name}: ${err.message} ` });
    });
