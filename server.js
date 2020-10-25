require('dotenv').config()
require('./worker');
require('./config/database');
const express = require('express');
const logger = require('morgan');
const messages = require('./routes/messages') ;
const users = require('./routes/users');
const bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const app = express();
app.set('secretKey', process.env.SECRET_KEY); // Clave Secreta para nuestro JWT

 
app.use(logger('dev'));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
app.get('/', function(req, res){
res.json({"Broker HTTP" : "See readme to for learn instructions"});
});
// Rutas publicas
app.use('/users', users);
// Rutas privadas que solo pueden ser consumidas con un token generado
app.use('/messages', validateUser, messages);
app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});
// Para acceder a las rutas de peliculas hemos definido middleware para validar al usuario.
function validateUser(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
    if (err) {
      res.json({status:"error", message: err.message, data:null});
    }else{
      // add user id to request
      req.body.userId = decoded.id;
      next();
    }
  });
  
}
// Manejando errores HTTP 404 para solicitudes de contenido inexistente
app.use(function(req, res, next) {
 let err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// Manejo de errores, respuestas con codigo HTTP 500, HTTP 404
app.use(function(err, req, res, next) {
 console.log(err);
 
  if(err.status === 404)
   res.status(404).json({message: "Not found"});
  else 
    res.status(500).json({message: "Error interno en el servidor!!"});
});
app.listen(3000, function(){
 console.log('El servidor ha sido inicializado: http://localhost:3000');
});