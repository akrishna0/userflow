const mongoose = require('mongoose');


const connectWithDatabase = ()=>{
    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log('DB GOT CONNECTED '))
    .catch((error)=>{
        console.log('DB CONNECTION FAILED ');
        console.log(error);
        process.exit(1);
    });
};

module.exports = connectWithDatabase;