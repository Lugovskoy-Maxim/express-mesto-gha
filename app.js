const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const routesUser = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const { validateLogin, validateRegister } = require('./middlewares/validation');
const NotFoundError = require('./errors/NotFoundError'); // 404

const { PORT = 3000, MANGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
mongoose.connect(MANGO_URL);
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// добавить проверку почты на уже созданиые

app.use('/signin', validateLogin, login);
app.use('/signup', validateRegister, createUser);
app.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});
// обработчик ошибок celebrate

app.use(auth);

app.use(cardRouter);
app.use(routesUser);
app.use('/*', () => new NotFoundError('Запрашиваемая страница не найдена'));
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Приложение запущено на порту ${PORT}`);
});
