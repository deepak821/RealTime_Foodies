const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000 || process.env.PORT;
const path = require('path');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts')

// connect DB
const url = "mongodb://localhost/realtimeFoodies"

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("I'm connected");
});

app.use(express.static('public'));

// Set Template Engine
app.use(expressLayout);

app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

require('./routes/web')(app);

app.listen(PORT, () =>{
    console.log(`connected at port ${PORT}`)
})