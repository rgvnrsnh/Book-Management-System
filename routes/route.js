const express = require("express");
const auth = require("../middleware/auth");
const { User, Book, Review } = require("../Modules/schemas");
const userController = require("../controller/userController");
const bookController = require("../controller/bookController");
const reviewController = require("../controller/reviewController");

const router = new express.Router();

router.get("/check", (req, res) => {
    console.log("router working");
    res.status(200).send({
        message: "working properly",
    });
});

/**********   USER  ***************/
//registering User
router.post("/register", userController.createUser);

// login User
router.post("/login", userController.loginUser);

//recommend books
router.get("/:userId/recommend", auth.authentication, userController.bookRecommendation);


/**********   BOOK  ***************/

//post book
router.post("/books", auth.authentication, bookController.createBook);

//get books
router.get("/books", auth.authentication, bookController.getBooks);

//get complete book details
router.get("/books/:bookId", auth.authentication, auth.authorization, bookController.getBookPlusReview);

// update book details
router.patch("/books/:bookid", auth.authentication, auth.authorization, bookController.updateBookDetails);

//delete book
router.delete("/books/:bookId", auth.authentication, auth.authorization, bookController.deleteBook);


/**********   REVIEW  ***************/

//create review
router.post("/books/:bookid/review", auth.authentication, reviewController.createReview);

//delete review
router.delete("/books/:bookid/review/:reviewid", auth.authentication, reviewController.deleteReview);

//update review
router.patch("/books/:bookid/review/:reviewid", auth.authentication, reviewController.updateReview);





module.exports = router;