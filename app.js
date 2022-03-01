require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const app = express();
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload')

const user = require('./routes/user');

// regular middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// cookies and fileupload
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

//morgan middleware
app.use(morgan("tiny"));

//routes
app.use('/api/v1',user);



module.exports = app;