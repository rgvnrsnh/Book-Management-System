const mongoose = require("mongoose");
const { User, Book, Review } = require("../Modules/schemas");
const validator = require("validator");
var jwt = require('jsonwebtoken');

const validid = function (id) {
    return mongoose.isValidObjectId(id);
};

const invalidrequest = function (data) {
    if (data === null && data === undefined)
        return true;
    else
        return false;
};


const authentication = async function (req, res, next) {

    try {

        const token = req.header("x-api-token");

        if (!token) {
            return res.status(200).send({
                message: "invalid token",
            });

        }

        const tokendata = await jwt.verify(token, process.env.SECRET_KEY);

        if (!tokendata) {
            return res.status(200).send({
                message: "token not matched"
            });
        }

        const userid = tokendata.userId;

        const check = await User.find({ _id: userid });

        if (check.length > 0) {
            next();
        }
        else {
            return res.status(200).send({
                message: "unauthorised login",
            });
        }

    }
    catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
}


const authorization = async function (req, res, next) {
    try {

        const token = req.header("x-api-token");

        if (!token) {
            return res.status(200).send({
                message: "invalid token",
            });

        }

        const tokendata = await jwt.verify(token, process.env.SECRET_KEY);

        if (!tokendata) {
            return res.status(200).send({
                message: "token not matched"
            });
        }

        const userid = tokendata.userId;

        const check = await User.find({ _id: userid });

        if (!check.length === 1) {
            return res.status(400).send({
                message: "user not authenticated"
            });
        }

        const bookid = req.params.bookid;

        const book = await Book.find({ _id: bookid });

        if (book[0].userId.toString() === userid) {
            next();
        }
        else {
            return res.status(400).send({
                message: "user not authorized"
            });
        }
    }
    catch (error) {
        return res.status(400).send({
            message: error.message,
        });
    }
}

module.exports.authentication = authentication;
module.exports.authorization = authorization;