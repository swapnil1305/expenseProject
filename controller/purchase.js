const Razorpay = require('razorpay');
const Order = require('../models/order');
const jwt = require('jsonwebtoken')
const generateAccessToken = (id,name,ispremiumuser)=>{
    return jwt.sign({userId: id, name: name, ispremiumuser}, 'secretkey');
}

const purchasePremium = async(req, res) => {
    try{
        var rzp = new Razorpay({
            key_id: 'rzp_test_K0UlPbw5xDPGMy',
            key_secret: 'XdenfACiJ8h4PTDd3JQ86HHR'
        })
        const amount= 2700;

        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderid: order.id, status: "PENDING"}).then(() => {
                return res.status(201).json({ order, key_id : rzp.key_id});
            }).catch(err => {
                throw new Error(err)
            })
        })
    }catch(err){
        console.log(err);
        res.status(403).json({message: 'Something went wrong', error:err})
    }
}

const updateTransactionStatus = async (req, res) => {
    try{
        const { payment_id, order_id} = req.body;
        const order = await Order.findOne({where: {orderid: order_id}})
        const promise1 = order.update({paymentid:payment_id, status: 'SUCCESSSFUL'})
        const promise2 = req.user.update({ispremiumuser: true})
        //console.log('qqqqqqqqqqqqqq')
        Promise.all([promise1, promise2]).then(() => {
            return res.status(202).json({success: true, message: 'Transaction Successful', token: generateAccessToken(undefined,undefined, true)});
        }).catch((err) => {
            throw new Error(err)
        })
    }catch(err){
        console.log(err);
        res.status(403).json({error:err, message: 'Something went wrong'})
    }
}
module.exports = {
    purchasePremium,
    updateTransactionStatus
}