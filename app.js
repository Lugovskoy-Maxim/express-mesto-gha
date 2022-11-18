const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const routesUser = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const { validateLogin, validateRegister } = require('./middlewares/validation');
const NotFoundError = require('./errors/NotFoundError');
// 404

const { PORT = 3000, MANGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
mongoose.connect(MANGO_URL);
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedCors = [ // список разрешенных адресов
  'https://api.lugo.nomoredomains.icu',
  'http://api.lugo.nomoredomains.icu',
  'https://lugo.nomoredomains.icu',
  'http://lugo.nomoredomains.icu',
  'localhost:3000',
];
// eslint-disable-next-line consistent-return
app.use((req, res, next) => {
  const { origin } = req.headers.referer; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE,FETCH';
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }

  next();
});
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
app.use('/*', () => { throw new NotFoundError('Запрашиваемая страница не найдена'); });

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
