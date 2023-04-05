const Razorpay=require('razorpay');
const Order=require('../models/orders');


require('dotenv').config();

const purchasepremium=async(req,res,next)=>{
try{
var rzp=new Razorpay({
    key_id:process.env.KEY_ID,
    key_secret:process.env.KEY_SECRET

})
const amount=2500;
const response = await rzp.orders.create({amount,currency:"INR"})
const order=new Order({orderid:response.id,status:'PENDING',userId:req.user})
await order.save();

return res.status(201).json({order,key_id:rzp.key_id,ispremiumuser:req.user.ispremiumuser});

}catch(err){
   console.log(err);
   res.status(403).json({message:'Something went wrong',error:err}) ;
}
}

const updatetransactionStatus=async(req,res)=>{
try{
    const userId=req.user.id;
    const{payment_id,order_id}=req.body;
    const order= await Order.findOne(order_id)
        order.updateOne({paymentid:payment_id,status:'SUCCESSFULL'}).then(()=>{
            req.user.updateOne({ispremiumuser:true}).then(()=>{
    return res.status(201).json({success:true,ispremiumuser:true,message:"Transaction Successful"});
 })
}).catch((err)=>{
    throw new Error(err);
}).catch((err)=>{
    throw new Error(err);
 })
}catch(err){
    console.log(err);
res.status(403).json({error:err,message:"Something went wrong"})
}
}

module.exports={
    purchasepremium,
    updatetransactionStatus
}