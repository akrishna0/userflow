require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const app = express();
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload')

// regular middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// cookies and fileupload
app.use(cookieParser());
app.use(fileUpload());
//morgan middleware
app.use(morgan("tiny"));

module.exports = app;