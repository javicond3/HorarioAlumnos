let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');

let session = require('express-session');
let CASAuthentication = require('cas-authentication');

let app = express();

// Variable para establecer el contexto cuando la app se despliegue en el servidor
const contextPath = path.normalize(process.env.CONTEXT);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(contextPath ,express.static(path.join(__dirname, 'public')));

// Set up an Express session.
app.use( session({
  secret            : process.env.SESSION_SECRET,
  resave            : false,
  saveUninitialized : true
}));

// Create a new instance of CASAuthentication.
const service_url = process.env.SERVICE;
const cas_url = process.env.CAS;

let cas = new CASAuthentication({
  cas_url: cas_url,
  service_url: service_url,
  cas_version: '3.0',
  session_info: 'user',
  destroy_session : true // Borra la sesión al hacer logout
});


/**
 * Rutas que comienzan por contextPath usan indexRouter.
 * Los clientes no autenticados son redirigidos al CAS login.
 * Después son redirigidos a la ruta deseada.
 */
app.use(contextPath, cas.bounce, indexRouter);

/**
 * Ruta para desautenticar al cliente.
 * Después redirige a la página de logout del CAS.
 */
app.get(path.join(contextPath, '/logout'), cas.logout);


// Helper dinamico:
/* app.use(function (req, res, next) {

    // Hacer visible req.session en las vistas
    res.locals.session = req.session;

    next();
}); */

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
