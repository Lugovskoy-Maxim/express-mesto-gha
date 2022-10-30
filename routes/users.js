const router = require('express').Router();
const { validateUserAvatar, validateUserInfo } = require('../middlewares/validation');

const {
  getUsers, findUserbyId, updateUser, updateAvatar, getUserInfo,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', findUserbyId);
router.get('/users/me', getUserInfo);
router.patch('/users/me', validateUserInfo, updateUser);
router.patch('/users/me/avatar', validateUserAvatar, updateAvatar);

module.exports = router;
