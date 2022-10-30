const express = require('express');
const mongoose = require('mongoose');

const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const routesUser = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const { validationLogin } = require('./middlewares/validation');

const { PORT = 3000, MANGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
mongoose.connect(MANGO_URL);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// добавить проверку почты на уже созданиые

app.use('/signin', validationLogin, login);
app.use('/signup', validationLogin, createUser);
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
