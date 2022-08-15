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
const Emitter = require('events')


// connect DB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("I'm connected");
});


// event emitter

const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

// setup session
app.use(session({
  secret : process.env.COOKIE_SECRET,
  resave : false,
  store: MongoDbStore.create({
    mongoUrl: process.env.MONGODB_URL,
    collectionName: 'sessions'    
  }),
  saveUninitialized : false,
  cookie : {maxAge : 1000 * 60 * 60 * 24}
}))

// passport config
const passportInit = require('./app/config/passport');
const { join } = require('path');
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// asset
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}))
app.use(express.json()) 

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
app.use((req, res) => {
  res.status(404).send("<h1>Page Not Found</h1>")
})

const server = app.listen(PORT, () =>{
    console.log(`connected at port ${PORT}`)
})

const io = require('socket.io')(server)

io.on('connection', (socket) => {
  //join
  socket.on('join', (roomName) => {
    socket.join(roomName)
  })
})

eventEmitter.on('orderUpdated', (data) => {
  io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
  io.to('adminRoom').emit('orderPlaced', data)
})