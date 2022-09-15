const express = require('express');
const cors = require('cors');

const { sequelize } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());

const authorizationRouter = require('./routes/authorization.router');
const customerRouter = require('./routes/customer.router');
const orderRouter = require('./routes/order.router');
const productRouter = require('./routes/product.router');
const categoryRouter = require('./routes/category.router');
const userRouter = require('./routes/user.router');
const indexRouter = require('./routes/index.router');

app.use('/authorization', authorizationRouter);
app.use('/customer', customerRouter);
app.use('/order', orderRouter);
app.use('/product', productRouter);
app.use('/category', categoryRouter);
app.use('/user', userRouter);
app.use('/', indexRouter);

const PORT = 5000;

app.listen(PORT, async () => {
    console.log('Server up on http://localhost:5000');
    await sequelize.authenticate();
    console.log('Database authenticated!');
})