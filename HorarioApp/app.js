const createError = require('http-errors');
const express = require('express');
const path = require('path');
const normalizePath = require('normalize-path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const favicon = require('serve-favicon');

const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const CASAuthentication = require('cas-authentication');

// Job scheduler
const schedule = require('node-schedule');

// Middleware para usar un marco común a todas las vistas
const partials = require('express-partials');

// Router principal
const indexRouter = require('./routes/index');

// Controlador de planes para la tarea programada
const planController = require('./controllers/planController');


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

// Set up an Express session with MemoryStore to avoid memory leaks.
app.use(session({
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({
    checkPeriod: 86400000, // prune expired entries every 24h
  }),
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

  // Guardar la información de la sesión cas en req.session.user
  // req.session.user = req.session[cas.user.info]

  next();
});

/**
 * Los clientes no autenticados son redirigidos al CAS login.
 * Además se comprueba que son alumnos.
 */
// app.use(cas.bounce, permissionController.checkStudentRole);

/**
 * Rutas que comienzan por contextPath usan indexRouter.
 */
app.use(contextPath, indexRouter);

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

// Tarea programada para actualizar planes

// Primera vez (solo al arrrancar)
setTimeout(() => { planController.updatePlanes(); }, 4000);

// Regla de recurrencia
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = 5; // Domingo
rule.hour = 19;
rule.minute = 40; // A las 00:00

// Programar tarea
const job = schedule.scheduleJob(rule, () => {
  planController.updatePlanes();
});


module.exports = app;
