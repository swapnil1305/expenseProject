const express = require('express');

const userController = require('../controller/user');
const expenseController = require('../controller/expense');

const authenticatemiddleware  = require('../middleware/auth');
const router = express.Router();


router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.post('/addexpense', authenticatemiddleware.authenticate, expenseController.addExpense);

router.post('/getexpense',authenticatemiddleware.authenticate, expenseController.getExpense);

 router.get('/download', authenticatemiddleware.authenticate, expenseController.downloadExpense);

router.delete('/deleteexpense/:expenseid', authenticatemiddleware.authenticate, expenseController.deleteExpense);


module.exports = router;