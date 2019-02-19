// Middleware para imprimir información de debug

exports.session = function (req, res, next) {
    console.log(req.session);
    next();
}

/* JSON Session format

Session {
    cookie:
     { path: '/',
       _expires: null,
       originalMaxAge: null,
       httpOnly: true },
    cas_return_to: '/',
    cas_user: 'daniel.criado.benitez@alumnos.upm.es',
    user:
     { isfromnewlogin: 'true',
       mail: 'daniel.criado.benitez@alumnos.upm.es',
       authenticationdate: '2019-02-19T18:44:29.204+01:00',
       cn: 'DANIEL',
       irispersonaluniqueid: '51007192',
       irispersonaltitle: 'V',
       o: '09',
       'ldapauthenticationhandler.dn':
        'uid=daniel.criado.benitez@alumnos.upm.es,ou=Users,dc=upm,dc=es',
       employeetype: 'A',
       longtermauthenticationrequesttokenused: 'false',
       sn: 'CRIADO BENITEZ',
       irispersonaluniqueidupm: '51007192T' } } */
 
  