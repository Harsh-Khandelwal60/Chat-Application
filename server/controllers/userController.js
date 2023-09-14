const User = require('../model/usermodel');
const bcrypt=require('bcrypt');



module.exports.register = async (req , res, next) => {
    try {
        
    const { username , email, password } = req.body;
    const usernameCheck = await User.findOne({username});

    if(usernameCheck){
        return res.json({msg:"Username already Used" , status:false});
    }                                                                                                    
        const emailCheck = await User.findOne({email});

    if(emailCheck)
    {
        return res.json({msg:"Email already Used" , status:false});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
         email , username , password:hashedPassword
    });

    delete user.password;
    return res.json({status:true , user});
    } catch (error) {
        next(error);
    }

}


module.exports.login = async (req , res, next) => {
    try {
    const { username , password } = req.body;
    const user = await User.findOne({username});
    if(!user)
        return res.json({msg:"Incorrect Username and Password" , status:false});
        const ispasswordValid = await bcrypt.compare(password, user.password)
    if(!ispasswordValid)
    return res.json({msg:"Incorrect Username and Password" , status:false});
    delete user.password;
    return res.json({status:true , user});
    } catch (error) {
        next(error);
    }

}

module.exports.setAvatar = async (req,res,next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findById(userId,
            {
                isAvatarImageSet:true,
                avatarImage: avatarImage,   
            },
            { new: true }
        );
        return res.json({isSet:userData.isAvatarImageSet, image:userData.avatarImage});
    } catch (error) {
        next(error);
    }
} 

module.exports.allUsers = async (req,res,next) => {
    try {
        const users = await User.findById({ _id:{$ne : req.params.id}}).select(["email", "username" , "avatarImage","_id"]);
        return res.json({users})
    } catch (error) {
        next(error);
    }
}