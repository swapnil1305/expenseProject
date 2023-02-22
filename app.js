const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./util/database');
const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order')
const Forgotpassword = require('./models/forgotpassword')
const DownloadedFile=require('./models/downloadedFile');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense')
const purchaseRoutes = require('./routes/purchase');
const resetPasswordRoutes = require('./routes/resetpassword')
const premiumFeatureRoutes = require('./routes/premiumFeature');

const app = express();
const dotenv = require('dotenv');

dotenv.config();

app.use(cors());

app.use(bodyParser.json()); //for handling forms
app.use(express.json());  //for handling jsons

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumFeatureRoutes);
app.use('/password', resetPasswordRoutes);


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(DownloadedFile);
DownloadedFile.belongsTo(User)

sequelize
.sync()
// .sync({force:true})
.then(result => { 
    app.listen(4000);
    //console.log(result);
})
.catch(err => console.log(err));