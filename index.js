const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/User');
require('./models/Survey');
// We are not exporting anything => no need for a variable e.g. const passportConfig = require('./services/passport');
require('./services/passport');

//const authRoutes = require('./routes/authRoutes'); // No need for this variable => instead see below

mongoose.connect(keys.mongoURI);
// ------------------------
// NOTE: To test out Mongo queries on node console, do the following:
// 1) Copy all from this file up until here (Line-1 => Line-14 == mongoose.connect(keys.mongoURI);)
// 2) Go to console
// 3) Type 'node' (to start node console)
// 4) Paste copied code to node console
// => This starts a fully functional node.js server with MOngoDB connection
// 5) Assign MOngo model(s) to a variable
// e.g. 5.1) const Survey = mongoose.model('surveys')
// 6) Type in your query
// e.g. 6.1) Survey.find({}).then(console.log)
// e.g. 6.2) Survey.find({ title: '(SPECIAL) SUPER FINAL TEST!!!' }).then(console.log)
// e.g. 6.3) Survey.find({ yes:0 }).then(console.log)
// e.g. 6.4) Survey.find({ _user: '5b05a12f571c8c5b040f0528' }).then(console.log)
// ------------------------
const app = express();

// Express Middlewares:
app.use(bodyParser.json());
// Tell express to use cookies and encrypt token with secret key
// maxAge = 30days in milliseconds
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Express Routes:
// This returns a func and immediately calls that func with app object => attach routes (in authRoutes) to app
require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets
  // like our main.js, or main.css file!
  app.use(express.static('client/build'));
  // Express will serve up the index.html file
  // if it doesn't recognise the route.
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT); // To run server: npm run start || npm run dev
