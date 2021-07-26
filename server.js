const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/UserRoute');
const authRoute = require('./routes/AuthRoute');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();

dotenv.config();


// app.use(jwt({ secret: process.env.jwtSecret, algorithms: ['HS256'] }));

mongoose.connect(process.env.mongodbserver, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true}, 
    () => {
    console.log("Connected to MongoDB Server");
        }
    );

    
//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.use(cookieParser());




//routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);


app.listen(5000, ()=> {
    console.log("Listening on port 5000");
})
