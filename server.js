const express = require('express');
const app = express();
const PORT = 3000 || process.env.PORT;
const path = require('path');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts')

app.use(express.static('public'));

// Set Template Engine
app.use(expressLayout);

app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

app.get('/', (req,res) => {
    res.render('home');
})

app.get('/cart', (req,res) => {
    res.render('customers/cart');
})

app.get('/login', (req, res) => {
    res.render('auth/login');
})

app.get('/register', (req, res) => {
    res.render('auth/register');
})

app.listen(PORT, () =>{
    console.log(`connected at port ${PORT}`)
})