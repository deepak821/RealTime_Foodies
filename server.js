require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000 || process.env.PORT;
const path = require('path');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo');
const passport = require('passport')

app.use(express.urlencoded({extended: false}))
app.use(express.json())

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


// setup session
app.use(session({
  secret : process.env.COOKIE_SECRET,
  resave : false,
  store: MongoDbStore.create({
    mongoUrl: "mongodb://localhost/realtimeFoodies",
    collectionName: 'sessions'    
  }),
  saveUninitialized : false,
  cookie : {maxAge : 1000 * 60 * 60 * 24}
}))

app.use(flash())

// passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

// asset
app.use(express.static('public'));

//global middleware
app.use((req,res,next) => {
  res.locals.session = req.session
  res.locals.user = req.user
  next()
})

// Set Template Engine
app.use(expressLayout);

app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

require('./routes/web')(app);

app.listen(PORT, () =>{
    console.log(`connected at port ${PORT}`)
})