const Card = require('../models/cards');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: 'Error type:', err }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
        return;
      }
      res
        .status(500)
        .send({ message: `Произошла ошибка ${err.name}: ${err.message} ` });
    });
};

module.exports.removeCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      const error = new Error('Пользователь с таким id не найден');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      const newLocal = card.owner.toString() === req.user._id;
      if (newLocal) {
        card.remove()
          .then(() => res.status(200).send({ message: 'Карточка удалена' }));
        return;
      }
      res.status(403).send({ message: 'Невозможно удалить чужую карточку' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      } if (err.statusCode === 404) {
        res.status(404).send({ message: 'карточка не найдена' });
        return;
      }
      res.status(500).send({ message: `Произошла ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .orFail(() => {
    const error = new Error('Пользователь с таким id не найден');
    error.statusCode = 404;
    throw error;
  })
  .then((card) => res.status(200).send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
      return;
    } if (err.statusCode === 404) {
      res.status(404).send({ message: 'карточка не найдена' });
      return;
    }
    res
      .status(500)
      .send({ message: `Произошла ошибка ${err.name}: ${err.message} ` });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .orFail(() => {
    const error = new Error('Пользователь с таким id не найден');
    error.statusCode = 404;
    throw error;
  })
  .then((card) => res.status(200).send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
      return;
    } if (err.statusCode === 404) {
      res.status(404).send({ message: 'карточка не найдена' });
      return;
    }
    res
      .status(500)
      .send({ message: `Произошла ошибка ${err.name}: ${err.message} ` });
  });
