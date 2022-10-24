require("dotenv").config()
const express = require('express');

const app = express();

const imageRouter = require('./routers/image-router')

app.use('/image', imageRouter)

//start app 
const port = process.env.PORT || 3000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);