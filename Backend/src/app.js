require('dotenv').config()
const express = require('express');
const app = express();

const port =  process.env.port || 8000;
const cors= require('cors');
require('../db/conn')

// Middleware to parse JSON
app.use(express.json());
// If you also send URL-encoded data (e.g., form submissions)
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(require('../routes/userrouter'))
app.use(require('../routes/createnote'))

// app.get('/' , (req,res)=> {
//     res.send("Hello");
// })

app.listen(port , ()=> {
    console.log(`localhost is listening on ${port}`)
}
);