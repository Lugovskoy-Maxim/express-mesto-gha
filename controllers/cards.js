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
      if (err.name === "CastError") {
        throw new BadRequestError("Передан некорректный id");
      }
      if (err.name === "ValidationError") {
        throw new BadRequestError("Неверено задано одно из полей");
      }
      res.status(500).send({ massage: `Произошла ошибка ${err.name}: ${err.message} `})
    });
};

module.exports.removeCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card.owner.toString() == req.user._id) {
        card.remove()
        .then(() => res.send({ message: 'Карточка удалена' }));
        return
      }
      res.send('Недостаточно прав для удаления');
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Передан некорректный id");
      }
      if (err.name === "ValidationError") {
        throw new BadRequestError("Неверено задано одно из полей");
      }
      res.status(500).send({ massage: `Произошла ошибка ${err.name}: ${err.message} `})
    });
}

module.exports.likeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )    .catch((err) => {
    if (err.name === "CastError") {
      throw new BadRequestError("Передан некорректный id");
    }
    if (err.name === "ValidationError") {
      throw new BadRequestError("Неверено задано одно из полей");
    }
    res.status(500).send({ massage: `Произошла ошибка ${err.name}: ${err.message} `})
  });

module.exports.dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }

  )
  .catch((err) => {
    if (err.name === "CastError") {
      throw new BadRequestError("Передан некорректный id");
    }
    if (err.name === "ValidationError") {
      throw new BadRequestError("Неверено задано одно из полей");
    }
    res.status(500).send({ massage: `Произошла ошибка ${err.name}: ${err.message} `})
  });
