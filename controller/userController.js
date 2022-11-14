const mongoose = require("mongoose");
const { User, Book, Review } = require("../Modules/schemas");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const validid = function (id) {
    return mongoose.isValidObjectId(id);
};

const validrequest = function (data) {
    if (data == null && data == undefined)
        return true;
    else
        return false;
};

const createUser = async function (req, res) {
    try {

        const data = req.body;

        if (validrequest(data)) {
            return res.status(200).send({
                message: "request can't be empty",
            });
        };

        const { title, name, phone, email, password, address, booktypes } = req.body;

        if (!["Mr", "Mrs", "Miss"].includes(title)) {
            return res.status(200).send({
                message: "invalid title",
            });
        };

        if (!name) {
            return res.status(200).send({
                message: "invalid name",
            });
        };

        if (!phone) {
            return res.status(200).send({
                message: "phone must have 10 digits",
            });
        };

        if (!validator.isEmail(email)) {
            return res.status(200).send({
                message: "invalld email",
            });
        };

        if (!password) {
            return res.status(200).send({
                message: "can't be blank",
            });
        };

        if (address.length != 3) {
            return res.status(200).send({
                message: "address must contain street ,city , pincode",
            });
        };

        if (booktypes.length < 1) {
            return res.status(200).send({
                message: "booktypes must contain atleast one genre",
            });
        };

        const createdAt = Date.now();
        data["createdAt"] = createdAt;

        const checkuser = await User.find(data);

        if (checkuser.size > 0) {
            return res.status(200).send({
                message: "User already exists"
            });
        };

        const createdUser = await User.create(data);

        if (createdUser) {
            return res.status(201).send({
                status: true,
                message: "User created successfully",
                data: createdUser,
            });
        };
    }
    catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
};


const loginUser = async function (req, res) {

    try {
        const data = req.body;

        if (validrequest(data)) {
            return res.status(200).send({
                message: "request can't be empty",
            });
        };

        const { email, password } = data;

        const userfound = await User.find({ email, password });

        if (userfound.length === 0) {
            return res.status(200).send({
                message: "invalid credentials or user not exists",
            });
        };

        const usertoken = await jwt.sign({
            userId: userfound[0]._id.toString(),
            exp: Math.floor(Date.now() / 1000) + (600 * 600),
        }, process.env.SECRET_KEY
        );

        res.setHeader("x-api-token", usertoken);

        res.status(200).send({
            message: `${userfound[0].name} logged in successfully`,
            token: usertoken,
        });
    }
    catch (error) {
        res.status(400).send({
            error: error.message,
        });
    }
};

const bookRecommendation = async function (req, res) {

    try {

        const token = req.header("x-api-token");

        const tokendata = await jwt.verify(token, process.env.SECRET_KEY);

        const userid = tokendata.userId;

        const checkuser = await User.find({ _id: userid });

        const liking = checkuser[0].booktypes;

        if (liking == undefined || liking == null) {
            return res.status(200).send({
                message: "no matching book found",
            });
        }

        let filter = { isDeleted: false };

        const booksfound = await Book.find(filter);

        var BookstoRecommend = [];

        for (let likes of liking) {
            for (let books of booksfound) {
                if (books.subcategory.includes(likes)) {
                    BookstoRecommend.push(books);
                }
            }
        }

        if (BookstoRecommend.length == 0) {
            return res.status(200).send({
                message: "no matching book found",
            });
        }
        else {
            return res.status(200).send({
                message: "recommended books are",
                books: BookstoRecommend,
            });
        }
    }
    catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
}


module.exports.loginUser = loginUser;
module.exports.createUser = createUser;
module.exports.bookRecommendation = bookRecommendation;