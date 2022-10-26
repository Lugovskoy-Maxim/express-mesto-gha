const router = require('express').Router();

const {
  getUsers, createUser, findUserbyId, updateUser, updateAvatar, login, register,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', findUserbyId);
router.post('/users', createUser);
router.post('/signup', register);
router.post('/signin', login);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
