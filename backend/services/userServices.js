const { responsecodes } = require("../constants/responsecode")
const User = require("../models/userModel")

const findEmail = async (userEmail)=> {
    try {
        const emailExist = await User.findOne({email: userEmail})
        if(!emailExist){
            return {code: responsecodes.NOT_FOUND, success: false, data: 'Email not found'}
        }
        return {code: responsecodes.SUCCESS, success: true, data: emailExist}
    } catch (error) {
        throw 'error occured while looking for email' + ' ' + error
    }
}

const createUser = async (username, email, password)=> {
    try {
        const newUser = await User.create({
            username,
            email,
            password
        })
        return {code: responsecodes.SUCCESS, success: true, data: newUser}
    } catch (error) {
        throw 'error occured while creating user' + ' ' + error
    }
}


module.exports = {
    findEmail,
    createUser
}