const mongoose = require("mongoose");
const { User, Book, Review } = require("../Modules/schemas");
const validator = require("validator");
var jwt = require('jsonwebtoken');

const validid = function (id) {
    return mongoose.isValidObjectId(id);
};

const invalidrequest = function (data) {
    if (data == null && data == undefined)
        return true;
    else
        return false;
};


const createBook = async function (req, res) {
    try {

        const data = req.body;

        if (invalidrequest(data)) {
            return res.status(200).send({
                message: "request can't be empty",
            });
        }

        const { title, excerpt, ISBN, category, subcategory, isDeleted, reviews, releasedAt } = data;

        if (!title) {
            return res.status(200).send({
                message: "title can't be empty",
            });
        }

        if (!excerpt) {
            return res.status(200).send({
                message: "excerpt can't be empty",
            });
        }

        if (!ISBN) {
            return res.status(200).send({
                message: "ISBN can't be empty",
            });
        }

        if (category.length === 0) {
            return res.status(200).send({
                message: "category can't be empty",
            });
        }

        if (subcategory.length === 0) {
            return res.status(200).send({
                message: "subcategory can't be empty",
            });
        }

        if (isDeleted) {
            return res.status(200).send({
                message: "isDeleted can't be true initially",
            });
        }

        const token = req.header("x-api-token");

        const tokendata = jwt.verify(token, process.env.SECRET_KEY);

        const userId = tokendata.userId;

        data["userId"] = userId;
        data["createdAt"] = Date.now();

        var date = new Date();
        const releasedate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

        data["releasedAt"] = releasedate;

        const check = await Book.find(data);

        if (check.length > 0) {
            return res.status(200).send({
                message: "Book already exists",
            });
        }

        const createdbook = await Book.create(data);

        return res.status(201).send({
            message: "book created successfully",
            data: createdbook
        });
    }
    catch (error) {
        res.status(400).send({
            error: error.message,
        });
    }
}


module.exports.createBook = createBook;








