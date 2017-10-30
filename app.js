var express           = require('express');
var path              = require('path');
var favicon           = require('serve-favicon');
var logger            = require('morgan');
var cookieParser      = require('cookie-parser');
var session           = require('express-session');
var bodyParser        = require('body-parser');
var SessionFileStore  = require('session-file-store')(session);


var index            = require('./routes/index');
var wallet           = require('./routes/wallet');
var transfer         = require('./routes/transfer');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// bagian session atau cookie
app.use(session({
	name: 'SESS_ID',
	secret: '^#$5sX(HrrhUo!#65^',
	resave: true,
	saveUninitialized: true,
	cookie: {
		secure: false, // kenapa haruse secure false? Ini agak aneh karena kalau true, maka session tidak tersimpan
		httpOnly: true
	},
	store: new SessionFileStore()
}));

app.use('/', index);
app.use('/wallet', wallet);
app.use('/transfer', transfer);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  	var err = new Error('Not Found');
  	err.status = 404;
  	next(err);
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
