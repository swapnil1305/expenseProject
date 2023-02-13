const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./util/database');
const User = require('./models/user');
const userRoutes = require('./routes/user');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded()); //for handling forms
app.use(express.json());  //for handling jsons
app.use('/user', userRoutes);


User.sync()
.then(result => { 
    app.listen(4000);
    console.log(result);
})
.catch(err => console.log(err));