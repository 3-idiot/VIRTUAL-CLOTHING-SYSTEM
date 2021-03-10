const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

//my Model
const user= require('./router/signUp');

require('dotenv').config();

const app = express();

const port = process.env.port || 1234 ; 

const uri =process.env.localhost_uri;
mongoose.connect(uri , { useNewUrlParser : true , useCreateIndex : true , useUnifiedTopology : true });
mongoose.connection
          .once('open',()=>console.log("MongoDB Connected"))
          .on('error',error=>{console.log("my Error",console.error)});

          
app.use(cors());
app.use(express.json());
app.use('/user',user);

app.listen(port,()=>{
  console.log(`Sever is running on port : ${port}`)
});
