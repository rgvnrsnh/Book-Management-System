const mongoose = require("mongoose");
const { User, Book, Review } = require("../Modules/schemas");
const validator = require("validator");

const validid = function (id) {
    return mongoose.isValidObjectId(id);
};

const invalidrequest = function (data) {
    if (data == null && data == undefined)
        return true;
    else
        return false;
};


const createReview = async function (req, res) {

    try {

        const bookid = req.params.bookid;

        if (!mongoose.isValidObjectId(bookid)) {
            return res.status(200).send({
                message: "invalid bookId",
            });
        }

        const book = await Book.find({ _id: bookid });

        if (book.length != 1 || book.isDeleted == true) {
            return res.status(400).send({
                message: "no book found or deleted",
            });
        }

        let count = book[0].reviews;
        count++;
        book[0].reviews = count;

        const reviewData = req.body;
        reviewData["reviewedAt"] = Date.now();
        reviewData["bookId"] = bookid;

        const checkreview = await Review.find(reviewData);

        if (checkreview.length > 0) {
            return res.status(200).send({
                message: "Review already exists"
            });
        }

        const savedreview = await Review.create(reviewData);
        await book[0].save();

        return res.status(201).send({
            message: "review created successfully",
            status: true,
            review: savedreview
        });

    }
    catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
}




const deleteReview = async function (req, res) {

    try {

        const bookid = req.params.bookid;
        const reviewid = req.params.reviewid;

        if (!mongoose.isValidObjectId(bookid) || !mongoose.isValidObjectId(reviewid)) {
            return res.status(200).send({
                message: "invalid Id",
            });
        }


        const review = await Review.find({ _id: reviewid });

        if (review.length != 1 || review[0].isDeleted === true) {
            return res.status(400).send({
                message: "no review found or deleted",
            });
        }

        const book = await Book.find({ _id: bookid });

        if (book.length != 1 || book[0].isDeleted === true) {
            return res.status(400).send({
                message: "no book found or deleted",
            });
        }

        let count = book[0].reviews;
        (count - 1 < 0) ? count = 0 : count--;
        book[0].reviews = count;

        await book[0].save();

        review[0].isDeleted = true;
        review[0].deletedAt = Date.now();

        const deletedreview = await review[0].save();

        return res.status(201).send({
            message: "review deleted successfully",
            review: deletedReview
        });

    }
    catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
}



const updateReview = async function (req, res) {

    try {
        const bookid = req.params.bookid;
        const reviewid = req.params.reviewid;

        if (!mongoose.isValidObjectId(bookid) || !mongoose.isValidObjectId(reviewid)) {
            return res.status(200).send({
                message: "invalid Id",
            });
        }

        const reviewfound = await Review.find({ _id: reviewid });

        if (reviewfound.length != 1 || reviewfound[0].isDeleted === true) {
            return res.status(400).send({
                message: "no review found or deleted",
            });
        }

        const book = await Book.find({ _id: bookid });

        if (book.length != 1 || book[0].isDeleted === true) {
            return res.status(400).send({
                message: "no book found or deleted",
            });
        }

        const data = req.body;

        const { review, rating, reviewedBy } = data;

        if (review) reviewfound[0].review = review;
        if (rating) reviewfound[0].rating = rating;
        if (reviewedBy) reviewfound[0].reviewedBy = reviewedBy;

        const updatedreview = await reviewfound[0].save();

        return res.status(203).send({
            message: "review updated successfully",
            newreview: updatedreview,
        });

    }
    catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
}


module.exports.createReview = createReview;
module.exports.deleteReview = deleteReview;
module.exports.updateReview = updateReview;