const express = require('express');
const mongoose = require('mongoose');
const routesUser = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000, MANGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
mongoose.connect(MANGO_URL);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6354e304e74a251de9b551bd',
  };
  next();
});

app.use(cardRouter);
app.use(routesUser);
app.use('/*', (req, res) => res.status(404).send({ message: 'Произошла ошибка, пожалуйста проверте адрес запроса' }));

app.listen(PORT, () => {
  console.log(`Приложение запущено на порту ${PORT}`);
});
