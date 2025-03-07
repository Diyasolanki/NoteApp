const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URI)
.then(()=> {
    console.log('Db connection established');
})
.catch((err) => {
    console.log('DB connection error');
})

