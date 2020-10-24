// Cargamos el modulo express
const express = require('express');
const router = express.Router();
// Cargamos el controlador de los mensajes
const messageController = require('../app/api/controllers/messages');
// Especificamos nuestras rutas teniendo en cuenta los metodos creados en nuestro controlador
router.get('/', messageController.getAll);
router.post('/', messageController.create);
router.get('/:messageId', messageController.getById);
router.put('/:messageId', messageController.updateById);
router.delete('/:messageId', messageController.deleteById);
module.exports = router;