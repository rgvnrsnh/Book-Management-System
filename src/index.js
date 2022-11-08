const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const router = require("../routes/route");
const colors = require("colors");

dotenv.config();
const app = express();

app.use(express.json());
app.use(router);

const port = process.env.PORT;

const connection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);

    }
    catch (error) {
        console.log(`Error:${error}`.red.bold);
        process.exit();
    }
};

connection();

app.get("/", router);

app.listen(port, (req, res) => {
    console.log(`server started at port ${port}`.yellow.bold);
})



