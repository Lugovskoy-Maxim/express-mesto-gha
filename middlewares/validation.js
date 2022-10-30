const { celebrate, Joi } = require('celebrate');

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.link(),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.link(),
  }),
});

module.exports = {
  validateLogin,
  validateUserAvatar,
  validateUserInfo,
  validateUser,
};
