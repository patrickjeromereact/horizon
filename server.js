const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const authRouter = require('./router/approuter');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const PORT = 3002;

// Set view engine
app.use(express.static('public'))

// Set Templating Engine
app.use(expressLayouts)
app.set('layout', './layouts/full-width')
app.set('view engine', 'ejs')

// Routes
app.get('', (req, res) => {
    res.render('login', { title: 'Login', error: ''})
})

app.get('', (req, res) => {
    res.render('register', { title: 'Register', error: ''})
})

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Middleware
app.use('/', authRouter);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/horizon_assistant', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});