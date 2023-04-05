const Expense=require('../models/expense');
const User=require('../models/user');


const getLeaderUserBoard=async(req,res)=>{
try{
    const users=await User.find()
    const expenses=await Expense.find()
    const userAggregatedExpenses={}
    expenses.forEach((expense)=>{
        if(userAggregatedExpenses[expense.userId]){
            userAggregatedExpenses[expense.userId] = userAggregatedExpenses[expense.userId] + expense.price
        }else{
            userAggregatedExpenses[expense.userId]=expense.price
        }
    })
    // console.log(userAggregatedExpenses)
    var leaderBoardofusers=[];
    users.forEach((user)=>{
        leaderBoardofusers.push({id: user._id,name:user.username,totalExpense:(userAggregatedExpenses[user.id]||0)})

    })
    console.log(leaderBoardofusers)
   res.status(200).json(leaderBoardofusers);

}catch(err){
    console.log(err);
    res.status(500).json(err);
}
}



module.exports={
    getLeaderUserBoard
}