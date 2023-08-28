const bcrypt = require("bcryptjs")
const expressAsyncHandler = require("express-async-handler")
const { responsecodes } = require("../constants/responsecode")
const { findEmail, createUser, generateLoginToken, findUserById, findUserByIdAndUpdate } = require("../services/userServices")

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
const Login = expressAsyncHandler(async(req, res) => {
    const {email, password} = req.body
    try {
        if(!email || !password) {
            return res.status(responsecodes.BAD_REQUEST).json('Please fill form Completely')
        }

        //if the email is registered
        const registeredEmail = await findEmail(email)
        if(!registeredEmail.success){
            return res.status(responsecodes.NOT_FOUND).json(registeredEmail)
        } 

        //compare password with user password in the database
        const registeredPassword = await bcrypt.compare(password, registeredEmail.password)
        if(!registeredPassword){
            return res.status(responsecodes.NOT_FOUND).json('Email and password not registered')
        }

        const regsiteredUser = registeredEmail
        if(regsiteredUser && registeredPassword) {
            //generate accessToken
            generateLoginToken(res, regsiteredUser_id)
            const {password, ...others} = regsiteredUser._doc
            return res.status(responsecodes.SUCCESS).json(others)
        } else {
            return res.status(responsecodes.NOT_FOUND).json('User not found or not registered')
        }

    } catch (error) {
        return res.status(responsecodes.INTERNAL_SERVER_ERROR).json(error)
    }
})

//logout User
const Logout = async(req, res)=> {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    })
    return res.status(responsecodes.SUCCESS).json('Logged out user')
}

//Get user profile
const UserProfile = async(req, res)=> {
    const user = {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email
    }
    return res.status(responsecodes.SUCCESS).json(user)
}

//Update User Profile
const UpdateProfile = async(req, res) => {
    const {_id} = req.user
    const { password, ...others} = req.body

    try {
    let updateUserProfile;
    
    if(req.body.password){
        //hash the password
        const salt = await bcrypt.genSalt(10)
        const newPassword = await bcrypt.hash(req.body.password, salt)
        updateUserProfile = {
            password: newPassword,
            ...others
        }
    } else {
        updateUserProfile = req.body
    }

    const response = await findUserByIdAndUpdate(_id, updateUserProfile)

    if(!response.success){
        return res.status(response.code).json(response.data)
    }
    return res.status(response.code).json(response.data)

    } catch (error) {
    return res.status(responsecodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

module.exports = {
    Login,
    Register,
    Logout,
    UserProfile,
    UpdateProfile
}