const router = require('express').Router();

const {
  getUsers, findUserbyId, updateUser, updateAvatar, getUserInfo,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', findUserbyId);
router.get('/users/me', getUserInfo);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
