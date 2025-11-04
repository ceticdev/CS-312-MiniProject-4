require('dotenv').config();

// import modules
const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const path = require('path');

// create Express application
const app = express();
const port = 3000;

// serve static files from public directory
app.use(express.static('public'));
// parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: true }));
// parse JSON bodies
app.use(express.json());


// configure session middleware with 
// secret from env or generate random one
app.use(session({
    secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// import route modules
const authApiRouter = require('./routes/authApi');
const postsApiRouter = require('./routes/postsApi');

// mount auth and posts routers
app.use('/api/auth', authApiRouter);
app.use('/api/posts', postsApiRouter);

// For production build:
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.get(/\/((?!api).)*$/, (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  }
});

// start server, listen on port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});