const express = require('express');

const expenseController = require('../controller/expense');
const userauthentication = require('../middleware/auth')

const router = express.Router();

router.post('/addexpense',userauthentication.authenticate, expenseController.addExpense)

router.get('/getexpense', userauthentication.authenticate, expenseController.getExpense)

router.delete('/deleteexpense/:expenseid', userauthentication.authenticate, expenseController.deleteExpense)

module.exports = router; 