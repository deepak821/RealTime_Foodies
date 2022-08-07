const Local = require('passport-local')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')

function init(passport){
    passport.use(new Local({usernameField: 'email'}, async (email, password, done) => {
        //login

        //check if user exist
        const user = await User.findOne({email: email})

        if(!user){
            return done(null, false, {message: 'No User Exist!'})
        }

        bcrypt.compare(password, user.password).then(matched => {
            if(matched){
                return done(null, user, {message: 'Logged in Successfully!'})
            }
            else{
                return done(null, false, {message: `Wrong username or password`})
            }
        }).catch(err => {
            return done(null, false, {message: `Something went wrong!`})
        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}

module.exports = init