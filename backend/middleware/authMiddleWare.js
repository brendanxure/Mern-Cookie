import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel";
import { responsecodes } from "../constants/responsecode";
import { json } from "express/lib/response";

const validateToken = expressAsyncHandler(async(req, res, next)=> {
    let token;

    token = req.cookies.jwt

    if(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, response) => {
                if (err) {
                    return err
                }
                return response
            });
    
            if (decoded.message === 'invalid signature') {
                return res.status(responsecodes.UNAUTHORIZED).json('Invalid Code, Unauthorized')
            } else if (decoded.message === 'jwt expired') {
                return res.status(responsecodes.UNAUTHORIZED).json('Token has expired, Please try again')
            }

            const user = await User.findById(decoded.id).select('-password')

            if(!user){
                return res.status(responsecodes.NOT_FOUND).json('Token is invalid')
            }
            req.user = user 

            next()
        } catch (error) {
            throw 'Not authorized, invalid token' + ' ' + error
        }

    }else {
        return res.status(responsecodes.UNAUTHORIZED),json('Not authorized, no token')
    }
})


module.exports = {
    validateToken
}