const User = require('../models/user');

function isstringinvalid(string){
    if(string == undefined || string.length === 0){
        return true
    }
    else{
        return false
    }
}

exports.signup = async(req, res, next) => {
    try{
        const {name, email, password} = req.body;
        if (isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({err: "something is missing!!"})
        }
        await User.create({name, email, password})
        res.status(201).json({message: "successfully created new user"})
    }catch(err) {
        res.status(500).json(err);
    }
}
