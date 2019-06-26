const createError = require('http-errors');
const express = require('express');
const path = require('path');
const normalizePath = require('normalize-path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const favicon = require('serve-favicon');

const session = require('express-session');
const CASAuthentication = require('cas-authentication');

// Middleware para usar un marco común a todas las vistas
const partials = require('express-partials');

// Router principal
const indexRouter = require('./routes/index');

const app = express();

// Variable para establecer el contexto cuando la app se despliegue en el servidor
const contextPath = normalizePath(process.env.CONTEXT);

// Middleware para imprimir información de debug
const printController = require('./controllers/printController');

// Middleware que comprueba que el usuario autenticado en el CAS es un alumno
const permissionController = require('./controllers/permissionController');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method')); // override with POST having ?_method=DELETE
app.use(contextPath, express.static(path.join(__dirname, 'public')));
app.use(partials());

// Set up an Express session.
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Create a new instance of CASAuthentication.
const serviceUrl = process.env.SERVICE;
const casUrl = process.env.CAS;

const cas = new CASAuthentication({
  cas_url: casUrl,
  service_url: serviceUrl,
  cas_version: '3.0',
  session_info: 'user',
  destroy_session: true, // Borra la sesión al hacer logout
});

// Helper dinamico:
app.use((req, res, next) => {
  // Hacer visible req.session en las vistas
  res.locals.session = req.session;

  // Pasar contextPath a las vistas
  res.locals.contextPath = contextPath;
  console.log(contextPath);


  // Guardar la información de la sesión cas en req.session.user
  // req.session.user = req.session[cas.user.info]

  next();
});

// Para que la redireccón del CAS funcione.
// Por permisos no podemos redirigir directamente
// a localhost/contextPath.
const checkFirstTime = (req, res, next) => {
  if (!req.session.user.noFirst) {
    req.session.user.noFirst = true;
    res.redirect(contextPath);
  } else {
    next();
  }
};

/**
 * Rutas que comienzan por contextPath usan indexRouter.
 * Los clientes no autenticados son redirigidos al CAS login.
 * Después son redirigidos a la ruta deseada.
 */
app.use(contextPath,
  // cas.bounce,
  // printController.session,
  // permissionController.checkStudentRole,
  // checkFirstTime,
  indexRouter);

// app.use(contextPath, indexRouter);

/**
 * Ruta para desautenticar al cliente.
 * Después redirige a la página de logout del CAS.
 */
app.get(path.join(contextPath, 'logout'), cas.logout);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
