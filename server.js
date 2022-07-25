const express = require('express');
const app = express();
const PORT = 3000 || process.env.PORT;
const path = require('path');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts')

app.use(express.static('public'));

app.get('/', (req,res) => {
    res.render('home');
})

// Set Template Engine
app.use(expressLayout);

app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

app.listen(PORT, () =>{
    console.log(`connected at port ${PORT}`)
})