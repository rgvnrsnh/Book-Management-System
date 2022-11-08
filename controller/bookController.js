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


const getBooks = async function (req, res) {
    try {

        let filter = { isDeleted: false };

        const data = req.query;

        const { userId, category, subcategory } = data;

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(200).send({
                message: "invalid user id",
            });
        }



        if (category != null && category != undefined) {
            filter["category"] = category;
        }

        if (subcategory != null && subcategory != undefined) {
            filter["subcategory"] = subcategory;
        }

        if (userId != null && userId != undefined) {
            filter["userId"] = userId;
        }

        console.log(filter);

        const booksfound = await Book.find(filter, { _id: 1, title: 1, excerpt: 1, userId: 1, releasedAt: 1, category: 1 });

        if (booksfound.length > 0) {
            return res.status(200).send({
                message: "books founds are",
                data: booksfound
            });
        }
        else {
            return res.status(400).send({
                message: "no book found with suh details",
            });
        }
    }
    catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
}



const getBookPlusReview = async function (req, res) {

    try {
        const data = req.params.bookId;

        if (!mongoose.isValidObjectId(data)) {
            return res.status(200).send({
                message: "invalid bookId",
            });
        }

        const bookdata = await Book.find({ _id: data });

        if (bookdata.length != 1) {
            return res.status(200).send({
                message: "no book found with such details",
            });
        }

        const reviews = await Review.find({ _id: data });

        bookdata["reviews"] = reviews;

        console.log(reviews, bookdata);
        return res.status(200).send({
            message: "details of books are",
            book: bookdata
        });
    }
    catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
}




const deleteBook = async function (req, res) {

    try {
        const data = req.params.bookId;

        const filter = {
            isDeleted: false,
            _id: data
        };

        if (!mongoose.isValidObjectId(data)) {
            return res.status(200).send({
                message: "invalid bookId",
            });
        }

        const bookpresent = await Book.find(filter);

        if (bookpresent.length === 1) {

            const date = new Date();
            const time = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

            const bookdata = await Book.findByIdAndUpdate({ _id: data }, { isDeleted: true, deletedAt: time });

            return res.status(200).send({
                message: "book deleted successfully",
            });
        }
        else {
            return res.status(402).send({
                message: "book not found or already deleted",
            });
        }
    }
    catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
}






module.exports.createBook = createBook;
module.exports.getBooks = getBooks;
module.exports.getBookPlusReview = getBookPlusReview;
module.exports.deleteBook = deleteBook;


