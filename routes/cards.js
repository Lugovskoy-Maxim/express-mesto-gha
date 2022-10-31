const router = require('express').Router();
const { validateCard, validateCardId } = require('../middlewares/validation');

const {
  getCards,
  createCard,
  removeCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', validateCard, createCard);
router.delete('/cards/:cardId', validateCardId, removeCard);
router.put('/cards/:cardId/likes', validateCardId, likeCard);
router.delete('/cards/:cardId/likes', validateCardId, dislikeCard);

module.exports = router;
