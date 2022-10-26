const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, CelebrateError, Segments} = require('celebrate');
const { isURL, isEmail } = require('validator');

const { errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const routesUser = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');

const { PORT = 3000, MANGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
mongoose.connect(MANGO_URL);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// email swap castom?
app.use('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email((value) => {
      if (!isEmail(value)) throw new CelebrateError('Некорректный Email');
      return value;
    }),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use('/signup', createUser);
// обработчик ошибок celebrate
app.use(errors());
app.use(auth);
app.use(cardRouter);
app.use(routesUser);
app.use('/*', (req, res) => res.status(404).send({ message: 'Произошла ошибка, пожалуйста проверте адрес запроса' }));
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Приложение запущено на порту ${PORT}`);
});
