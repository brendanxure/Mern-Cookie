const { responsecodes } = require("../constants/responsecode")

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(responsecodes.NOT_FOUND)
    next(error)
}

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === responsecodes.SUCCESS ? responsecodes.INTERNAL_SERVER_ERROR : res.statusCode
    let message = err.message

    if(err.name === "CastError" &&  err.kind === "ObjectId"){
        statusCode = responsecodes.NOT_FOUND
        message = "Resource not found"
    }

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'Production' ? null : err.stack
    })
}

module.exports = {notFound, errorHandler}