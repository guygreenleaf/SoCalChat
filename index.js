const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/UserRoute');
const authRoute = require('./routes/AuthRoute');

const app = express();

dotenv.config();

mongoose.connect(process.env.mongodbserver, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true}, 
    () => {
    console.log("Connected to MongoDB Server");
        }
    );

    
//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


//routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);


app.listen(5000, ()=> {
    console.log("Listening on port 5000");
})
