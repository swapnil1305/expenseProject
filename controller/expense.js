const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');

const addExpense = async(req, res, next) => {
        const t=await sequelize.transaction();
        try{
            const { amount, description, category } = req.body;

        if(amount == undefined || amount.length === 0){
            return res.status(400).json({success: false, message: 'Parameters missing'})
        }

      const expense =  Expense.create({amount, description, category, userId: req.user.id},{transaction: t})
            const totalExpense = Number(req.user.totalExpenses)+ Number(amount)
            await User.update({
                totalExpenses: totalExpense
            },{
                where : {id: req.user.id},
                transaction: t
            })
                await t.commit();
                res.status(200).json({expense:expense})
        }catch(err){
                await t.rollback();
                return res.status(500).json({success:false, error:err})
        }
    }

const getExpense = (req, res) => {
req.user.getExpenses().then(expenses=> {
        return res.status(200).json({expenses:expenses, success:true})
    }).catch(err => {
        console.log(err)
            return res.status(500).json({error: err, success: false})
        }) 
    }

const deleteExpense = async(req, res, next) => {
    try{
        const expenseid = req.params.expenseid;
        if(expenseid == undefined  || expenseid.length === 0){
           return res.status(400).json({success: false, message:"Parameters missing"})
        }
        const noofrows = await Expense.destroy({where: {id:expenseid}})
        if(noofrows === 0){
            return res.status(404).json({success: false, message: 'Expense does not belong to the user'})
        }
        return res.status(200).json({success: true, message:"Deleted Successfully"})
    }catch(err){
        console.log(err);
        return res.status(500).json({success: true, message:"Failed"})
    }
}

module.exports = {
    addExpense,
    getExpense,
    deleteExpense
}