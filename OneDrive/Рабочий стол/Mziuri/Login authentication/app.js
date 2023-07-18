if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config()                          // !
}



// Base
const express = require('express');
const app = express();
const ejs = require('ejs')
const passport = require('passport');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const initializePassport = require('./passport-config')
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override')


app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"))
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(flash());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride ("_method"))

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)




const users = []

const userModel = require('./models/users.model')



//! POST on /register
 app.post('/register',  checkNotAuthenticated, async (req, res) => {
     try{
         const user = new userModel(req.body)
         const savedUser = await user.save()
         const hashedPassword = await bcrypt.hash(req.body.password, 10)
         users.push({
            id: Date.now().toString(),
            username: req.body.username,
            surname: req.body.surname,
            email: req.body.email,
            password: hashedPassword
         })
        // console.log(users) //
         res.redirect('/login')

     }
     catch(error) {
         res.status(500).json({error: 'Error creating todo'})
         console.log(error)
     }
 })


//! POST on /login

app.post('/login',  checkNotAuthenticated, passport.authenticate('local', {
       successRedirect: '/home',
       failureRedirect: '/login',
       failureFlash: true,

       
}))






//! Routes

app.get('/',  checkNotAuthenticated, (req, res) => {
    res.render('home')
})

app.get('/login',  checkNotAuthenticated, (req, res) => {
    res.render('login')
})

app.get('/register',  checkNotAuthenticated, (req, res) => {
    res.render('register')
})

app.get('/home', checkAuthenticated, (req, res) => {
    res.render('lobby', {name: req.body.email})
})

app.delete("/logout", (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err)
        res.redirect('/home')
    })
    
})






//? END ROUTES

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next()
    } 
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
       return res.redirect('/home')
    }
    next()
}






//! Server
app.listen(4500, (req, res) => {
    console.log('listening on 4500')
})