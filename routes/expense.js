const express = require('express');

const expenseController = require('../controller/expense');

const router = express.Router();

router.post('/addexpense', expenseController.addExpense)

router.get('/getexpense', expenseController.getExpense)

router.delete('/deleteexpense/:expenseid', expenseController.deleteExpense)

module.exports = router;