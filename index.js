require('dotenv').config()
const app = require('./app')
const connectWithDatabase = require('./config/db');
const cloudinary = require('cloudinary')

//database connection
connectWithDatabase();

//cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running at port ${process.env.PORT}`);
})