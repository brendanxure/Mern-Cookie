const bcrypt = require("bcryptjs")
const expressAsyncHandler = require("express-async-handler")
const { responsecodes } = require("../constants/responsecode")
const { findEmail, createUser } = require("../services/userServices")

//REgister user
const Register = expressAsyncHandler(async(req, res) => {
    const {username, email, password} = req.body
   try {
    if(!username || !email || !password) {
        return res.status(responsecodes.BAD_REQUEST).json('Please fill form Completely')
    }

    //if another user has already used the same email
    const existingUser = await findEmail(email)
    if(existingUser.success){
        return res.status(responsecodes.DUPLICATE).json('Email address already used')
    }

    //hashpassword
    const salt = await bcrypt.genSalt(10)
    const hashpassword = await bcrypt.hash(password, salt)

    const newUser = await createUser(username, email, hashpassword)
    
    return res.status(responsecodes.SUCCESS).json(newUser)
   } catch (error) {
        return res.status(responsecodes.INTERNAL_SERVER_ERROR).json(error)
   }
})


//Login User
const Login = async(req, res) => {
    return res.status(responsecodes.SUCCESS).json({message: 'Login user'})
}

//logout User
const Logout = async(req, res)=> {
    return res.status(responsecodes.SUCCESS).json('Logged out user')
}

//Get user profile
const UserProfile = async(req, res)=> {
    return res.status(responsecodes.SUCCESS).json('User Profile gotten')
}

//Update User Profile
const UpdateProfile = async(req, res) => {
    return res.status(responsecodes.SUCCESS).json({message: 'Update user profile'})
}

module.exports = {
    Login,
    Register,
    Logout,
    UserProfile,
    UpdateProfile
}