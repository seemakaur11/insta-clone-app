const express = require('express');
const app = express();
const PORT = process.env.port || 5000;
const  mongoose = require('mongoose');
const {mongoUrl} = require("./keys");
const path = require("path");

const cors = require("cors")
app.use(cors())

require('./models/model')
require('./models/post')
app.use(express.json())
app.use(require("./routes/auth"))
app.use(require("./routes/createPost"))
app.use(require("./routes/user"))

mongoose.connect(mongoUrl);

mongoose .connection.on("connected",() =>{
    console.log("successfully connected to mongo")
})

mongoose .connection.on("error",() =>{
    console.log("not connected to mongo")
})


app.use(express.static(path.join(__dirname, "../frontend/build")));

app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/build/index.html")
  );
});


app.listen(PORT,()=>{
    console.log("server is running on " + PORT);
})