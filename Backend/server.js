const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(()=>
    console.log('Connected to MongoDB!'))
    .catch((err)=> console.error(err));

    app.get('/',(req,res)=>{
        res.send('Hello,backend is working!');
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
