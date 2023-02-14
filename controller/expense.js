const Expense = require('../models/expense');

exports.addExpense = async(req, res, next) => {
    try{
        const { amount, description, category } = req.body;
        if(amount == undefined || amount.length === 0){
            return res.status(400).json({success: false, message: 'Parameters missing'})
        }
        const data = await Expense.create({amount:amount, description: description, category:category})
       res.status(201).json({expenseDetails: data, succcess:true});
    }catch(err){
        res.status(500).json({success: false, error:err})
    }
}

exports.getExpense = async(req, res, next) => {
    try{
        const expenses = await Expense.findAll()
            return res.status(200).json({expenses:expenses, success:true})
        }catch(err){
            return res.status(500).json({error: err, success: false})
        }
    }

exports.deleteExpense = async(req, res, next) => {
    try{
        const expenseid = req.params.expenseid;
        if(expenseid == undefined  || expenseid.length === 0){
           return res.status(400).json({success: false, message:"Parameters missing"})
        }
        await Expense.destroy({where: {id:expenseid}})
        return res.status(200).json({success: true, message:"Deleted Successfully"})
    }catch(err){
        console.log(err);
        return res.status(500).json({success: true, message:"Failed"})
    }
}