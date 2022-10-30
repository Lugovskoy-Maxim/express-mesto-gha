const express = require('express');
const mongoose = require('mongoose');

const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const routesUser = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const { validateLogin } = require('./middlewares/validation');

const { PORT = 3000, MANGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
mongoose.connect(MANGO_URL);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// добавить проверку почты на уже созданиые

app.use('/signin', validateLogin, login);
app.use('/signup', validateLogin, createUser);
// обработчик ошибок celebrate
app.use(errors());
// app.use(auth);

app.use(cardRouter);
app.use(routesUser);
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});
app.use('/*', (req, res) => res.status(404).send({ message: 'Страницы не существует, пожалуйста проверте адрес' }));
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Приложение запущено на порту ${PORT}`);
});
