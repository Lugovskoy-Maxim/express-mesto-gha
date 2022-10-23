const router = require("express").Router();

const { getUsers, createUser, findUserbyId, updateUser, updateAvatar } = require("../controllers/users");

router.get("/users", getUsers);
router.get("/users/:id", findUserbyId);
router.post("/users", createUser);
router.patch("/users/me", updateUser);
router.patch("/users/me/avatar", updateAvatar);

module.exports = router;
