const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./util/database');
const User = require('./models/user');
const Expense = require('./models/expense')
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense')

const app = express();

app.use(cors());

app.use(bodyParser.json()); //for handling forms
app.use(express.json());  //for handling jsons

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize.sync()
.then(result => { 
    app.listen(4000);
    //console.log(result);
})
.catch(err => console.log(err));