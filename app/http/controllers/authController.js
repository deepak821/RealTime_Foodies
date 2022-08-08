const flash = require('express-flash');
const bcrypt = require('bcrypt')
const User = require('../../models/userModel');
const passport = require('passport');

const authController = () => {
    return{
        login(req, res){
            res.render('auth/login');
        },
        register(req, res){
            res.render('auth/register');
        },
        async postregister(req, res){
            const {name, email, password} = req.body
            if(!name || !email || !password){
                req.flash('error', 'All fields are required')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }

            User.exists({email: email}, (err, result) => {
                if(result){
                    req.flash('error', 'Email already exist')
                    req.flash('name', name)
                    req.flash('email', email)
                    return res.redirect('/register')
                }
            })
            // hash password
            const hashedPassword = await bcrypt.hash(password, 10)

            // create user
            const user = new User({
                name,
                email,
                password : hashedPassword
            })

            user.save().then((user) => {
                return res.redirect('/login')
            }).catch(err =>{
                req.flash('error', ' Something Went Wrong')
                return res.redirect('/register')
            })
        },
        postLogin(req, res, next){
            const { email, password }   = req.body
           // Validate request 
            if(!email || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }
            passport.authenticate('local', (err, user, info) => {
                if(err){
                    req.flash('error', info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }
                    return res.redirect('/')
                })
            })(req, res, next)
        },
        logout(req, res){
            req.logout(function(err) {
                if (err) { return next(err); }
                res.redirect('/login');
              });
        }
        
    }
}

module.exports = authController;