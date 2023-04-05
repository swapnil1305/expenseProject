const uuid = require('uuid');
const sib = require('sib-api-v3-sdk');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const ForgotPassword = require('../models/forgotpassword');

exports.forgotPassword = async (req,res,next) => {
    try{
    const {email} =req.body ;

    const user = await User.findOne({email: email});


    const forgotPassword = new ForgotPassword({active:true})
    forgotPassword.save();

    const id = forgotPassword._id;

    const client = sib.ApiClient.instance

    const apiKey = client.authentications['api-key']

    apiKey.apiKey = process.env.API_KEY

    const tranEmailApi = new sib.TransactionalEmailsApi()





    const sender = {
        email : 'swapnil7@gmail.com',
        name : 'swapnil'
    }



    const recievers = [
        {
            email : email,
        },
    ]



    tranEmailApi.sendTransacEmail({
        sender,
        to: recievers,
        subject: 'forgotpass please reset',
        textContent: `Follow the link and reset password`,
        htmlContent: `Click on the link below to reset password <br> <a href="http://localhost:5000/password/reset/${id}">Reset password</a>`,

    }).then((response)=>{
        //console.log('after transaction');
        return res.status(202).json({sucess: true, message: "password mail sent Successful"});
    }).catch(err=>console.log(err))
}catch(err){
    return res.status(500).json({ message: error});
}
}

exports.resetPassword = async (req,res,next) => {
    try {
        console.log('into reset')

        let id = req.params.id;

        ForgotPassword.findById(id).then(forgotPassword => {
            forgotPassword.active = false
            return forgotPassword.save();
        })
        if(!forgotpasswordRequest){
            return res.status(404).json({msg: 'User desnt exist'})
        }

        res.status(200).send(`<html>
        <script>
            function formsubmitted(e){
                e.preventDefault();
               
            }
        </script>
        <form action="/password/update/${id}" method="get">
            <label for="newpassword">Enter New password</label>
            <input name="newpassword" type="password" required></input>
            <button>reset password</button>
        </form>
    </html>`)

    res.end();
    } catch (error) {
        return res.status(500).json({ message: error});
    }
}

exports.updatePassword = async (req,res,next) => {
    console.log('into update');
    const { newpassword } = req.query;
    const { id } = req.params;


    console.log((newpassword) ) 
    try {
        const resetpasswordrequest  = await ForgotPassword.findOne({where:{id}})
        const user = await User.findOne({where:{id:resetpasswordrequest.userId }})
        if(!user){
            return res.status(404).json({ error: 'No user Exists', success: false})
        }

        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function (err,salt) {
            if(err){
                console.log(err)
                throw new Error(err);
            }
            bcrypt.hash(newpassword, salt, async(err, hash)=>{
                await user.update({ password:hash })
                res.status(201).json({message: 'Successfuly update the new password'})
            });
        })

    } catch (error) {
        return res.status(403).json({ error, success: false } )
    }
}