const dotenv = require('dotenv');
// Set path to .env file
dotenv.config({ path: './.env' });


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");
//const multer  = require('multer')
//const upload = multer({ dest: 'uploads/' })

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const catalogRouter = require("./routes/catalog"); //Import routes for "catalog" area of site

var app = express();

// Add helmet to the middleware chain.
// Set CSP headers to allow our Bootstrap and Jquery to be served
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  }),
);

// Set up rate limiter: maximum of twenty requests per minute
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});

// Set up mongoose connection
mongoose.set("strictQuery", false);
const mongoDB = process.env.DATABASE_URL
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Apply rate limiter to all requests
app.use(limiter);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression()); // Compress all routes
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname,'/public/images')));

// Function to serve all static files
// inside public directory.
// app.use(express.static('public'));
// app.use('/images', express.static('images'));
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });
// app.post
// ('/upload', upload.single('image'), (req, res) => {
// if (!req.file) {
// res.status(400).send('No file uploaded.');
// return;
// }

// // You can perform additional operations with the uploaded image here.
// res.status(200).send('Image uploaded and saved successfully.');
// });

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/catalog", catalogRouter); // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
