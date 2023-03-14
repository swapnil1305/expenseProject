const path = require('path');
require('dotenv').config()
//const fs = require('fs')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
//const helmet = require('helmet');
const compression = require('compression');
//const morgan = require('morgan');
//models--->>
const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order')
const Forgotpassword = require('./models/forgotpassword')
const DownloadedFile=require('./models/downloadedFile');

//routers--->>
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense')
const purchaseRoutes = require('./routes/purchase');
const resetPasswordRoutes = require('./routes/resetpassword')
const premiumFeatureRoutes = require('./routes/premiumFeature');
const downloadFilesRoute= require('./routes/allDownload')

const app = express();

//const dotenv = require('dotenv');
//dotenv.config();

//const accessLogStream = fs.createReadStream(path.join(__dirname, 'access.log'), {flags: 'a'})
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()); //for handling forms
app.use(express.json());  //for handling jsons
//app.use(helmet());
app.use(compression());
//app.use(morgan('combined', {stream: accessLogStream}));


//middlewares--->>
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumFeatureRoutes);
app.use('/password', resetPasswordRoutes);
app.use('/download', downloadFilesRoute);

// app.use((req, res) => {
//     console.log('urlll===>>>>>', req.url)
//     res.sendFile(path.join(__dirname, `public/${req.url}`));
// })

app.use((req, res) => {
    console.log(req.url)
    res.sendFile(path.join(__dirname, `${req.url}`))
})

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