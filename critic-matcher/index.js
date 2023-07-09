const express = require("express");
const app = express();
app.listen(3002, () => console.log("Server is running"));
let cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
//connecting to mongoDB
async function connect() {
    try {
        await mongoose.connect(
            process.env.MONGODB_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        console.log("connected to mongoDB");
    } catch (error) {
        console.log("couldn't connect to mongoDb");
    }

}
connect();
//adding a new student
const database = mongoose.connection
database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const routes = require('./routes/routes');

app.use('/api', routes)

