const mongoose = require("mongoose");

const user = new mongoose.Schema(
    {
        title: { type: String, required: true, enum: ["Mr", "Mrs", "Miss"], trim: true },
        name: { type: String, required: true, },
        phone: { type: Number, required: true, unique: true, },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, minLength: 8, maxLength: 15 },
        address: { type: [String] },
        createdAt: { type: Date }
    },
    { timestamps: true }
);

const books = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true, trim: true },
        excerpt: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, required: "UserId must be present", refs: "User" },
        ISBN: { type: String, required: true, unique: true },
        category: { type: String, required: true },
        subcategory: { type: [String], required: true },
        reviews: { type: Number, default: 0 },
        deletedAt: { type: Date, },
        isDeleted: { type: Boolean, default: false },
        releasedAt: { type: Date, required: true },
        createdAt: { type: Date }
    },
    { timestamps: true }
);

const review = new mongoose.Schema(
    {
        bookId: { type: mongoose.Schema.Types.ObjectId, required: "bookId must be present", refs: "Book" },
        reviewedBy: { type: String, required: true, default: 'Guest', value: { type: String } },
        reviewedAt: { type: Date, required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        review: { type: String, trim: true },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);



const User = new mongoose.model("User", user);
const Book = new mongoose.model("Book", books);
const Review = new mongoose.model("Review", review);



module.exports = { User, Book, Review };