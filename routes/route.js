const express = require("express");
const auth = require("../middleware/auth");
const { User, Book, Review } = require("../Modules/schemas");
const userController = require("../controller/userController");
const bookController = require("../controller/bookController");

const router = new express.Router();

router.get("/check", (req, res) => {
    console.log("router working");
});


//registering User
router.post("/register", userController.createUser);

// login User
router.post("/login", userController.loginUser);

//post book
router.post("/books", auth.authentication, bookController.createBook);

//get books
router.get("/books", auth.authentication, bookController.getBooks);

//get complete book details
router.get("/books/:bookId", auth.authentication, bookController.getBookPlusReview);

//delete book
router.delete("/books/:bookId", auth.authentication, bookController.deleteBook);










module.exports = router;