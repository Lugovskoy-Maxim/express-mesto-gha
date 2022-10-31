const Card = require('../models/cards');
const NotFoundError = require('../errors/NotFoundError'); // 404
const ForbiddenErrors = require('../errors/ForbiddenErrors'); // 403
const BadRequestError = require('../errors/BadRequestError'); // 400

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: 'Error type:', err }));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Ошибка. Проверьте правильность введенных данныхПередан некорректный id');
      }
      next(err);
    });
};

module.exports.removeCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Карточка с указаным id не найдена'))
    .then((card) => {
      const newLocalOwner = card.owner.toString() === req.user._id;
      if (newLocalOwner) {
        card.remove()
          .then(() => res.send({ message: 'Карточка удалена' }));
        return;
      }
      throw new ForbiddenErrors('Невозможно удалить чужую карточку');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      next(err);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .orFail(new NotFoundError('Карточка с указаным id не найдена'))
  .then((card) => res.send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new BadRequestError('Переданы некорректные данные');
    }
    next(err);
  })
  .catch(next);

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .orFail(new NotFoundError('Карточка с указаным id не найдена'))
  .then((card) => res.send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new BadRequestError('Переданы некорректные данные');
    }
    next(err);
  })
  .catch(next);
