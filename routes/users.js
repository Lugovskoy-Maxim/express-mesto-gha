const router = require('express').Router();

const {
  getUsers,
  createUser,
  findUserbyId,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', findUserbyId);
router.post('/users', createUser);

module.exports = router;