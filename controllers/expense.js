const Expense=require('../models/expense');
const User=require('../models/user');
const AWS=require('aws-sdk');
const Userservices=require('../services/userservices');
const S3services=require('../services/s3services');
const DownloadUrl = require('../models/downloadUrl')


exports.downloadexpense=async(req,res)=>{
try{
    const expense = await Expense.find({ userId: req.user._id})
    // console.log(expenses);
    const stringifiedExpense=JSON.stringify(expense);

    const userId=req.user._id;
    const filename=`Expense${userId}/${new Date()}.txt`;
    const fileURL=await S3services.uploadToS3(stringifiedExpense,filename);
    const downloadUrlData = new DownloadUrl({
        fileURL: fileURL,
        filename,
        userId: req.user
    })
    downloadUrlData.save();
    res.status(200).json({fileURL,downloadUrlData,success:true});
}catch(err){
    console.log(err);
res.status(500).json({fileURL:'',success:false,err:err});
}  
}

exports.downloadAllUrl = async(req,res,next) => {
    try {
        let urls = await DownloadUrl.find();
        if(!urls){
            res.sttus(404).json({ message: 'no urls found'})
        }
        res.status(200).json({ urls, success: true})
    } catch (error) {
        console.log(err);
        res.status(500).json({error})
    }
}

exports.postAddExpense=async(req,res,next)=>{

    try{
   const price=req.body.price;
   const description=req.body.description;
   const category=req.body.category;

   if(price==undefined||price.length==0){
    return res.status(400).json({success:false,message:"parameters Missing"})
   }

   const data = new Expense({
    price,
    description,
    category,
    userId: req.user
 });
 data.save();
 res.status(201).json({expenseDetails: data});
}catch (err){
    await t.rollback();
        console.log(err);
    }
}

exports.getExpenses=async(req,res,next)=>{
    try{
        let page = req.params.page || 1;
    let Items_Per_Page = +(req.params.Items_Per_Page);
    // console.log(page);
    // console.log(Items_Per_Page);
    let totalItems;
    let count = await Expense.count({ userId:req.user._id })  ;
      totalItems = count;
// console.log(count);
      const data = await Expense.find({ userId: req.user._id}).skip((page-1)*Items_Per_Page).limit( Items_Per_Page);
// console.log('------------------------');
// console.log(data);
    res.status(200).json({
        data,
        info: {
            currentPage: page,
            hasNextPage: totalItems > page * Items_Per_Page,
            hasPreviousPage: page > 1,
            nextPage: +page + 1,
            previousPage: +page - 1,
            lastPage: Math.ceil(totalItems / Items_Per_Page) 
        }
    });
    // const expenses=await Expense.findAll({where:{userId:req.user.id}});
    // res.status(200).json({allExpense:expenses});
    }catch(err){
        console.log(err);
        res.status(500).json({err:err});
    }
   }

   exports.deleteExpense=async(req,res,next)=>{

      try{
        const expenseid=req.params.id;
               const expense=await Expense.deleteOne({_id:expenseid,userId:req.user})
        res.status(200).json({success:true,message:'Deleted Successfully'})
    }
       catch(err){
           console.log(err);
       }
   }