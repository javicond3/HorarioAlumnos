
// Comprobamos que el usuario es un alumno
exports.checkStudentRole = (req, res, next) => {
  const role = req.session.user.employeetype;
  if (typeof role === 'string' && role.includes('A')) {
    next(); // Si es un alumno puede continuar
  } else {
    res.send('Lo sentimos, esta aplicación solo es accesible para alumnos.');
  }
};
