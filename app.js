const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const groupsRouter = require('./routes/groups');
const authRouter = require('./routes/auth');
const todosRouter = require('./routes/todos');
const categoriesRouter = require('./routes/categories');

app.use('/users', usersRouter);
app.use('/groups', groupsRouter);
app.use('', authRouter);
app.use('/todos', todosRouter);
app.use('/categories', categoriesRouter);


app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
