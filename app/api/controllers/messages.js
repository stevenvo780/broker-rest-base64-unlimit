const csv = require('csv-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const {Messages, createMessage, editMessage, deleteMessage } = require('../../../config/database')

module.exports = {
  // Metodo para la busqueda de videojuegos por ID
  getById: function (req, res, next) {
    Messages[0].forEach(message => {
      if (message._id == req.params.messageId) {
        res.json({ status: "success", message: "Message found!!!", data: { messages: message } });
      }
    });
  },
  //Metodo para retornar todos los videojuegos registrados en la base de datos
  getAll: function (req, res, next) {
    console.log(Messages[0].length)
    if (Messages[0].length > 0) {
      res.json({ status: "success", message: "Message found!!!", data: { messages: Messages[0] } });
    } else {
      res.json({ status: "success", message: "Message not found", data: { messages: [] } });
    }
  },
  //Metodo para actualizar algun registro de la base de datos por ID
  updateById: function (req, res, next) {
    let responseCreated = editMessage(
      req.params.messageId,
      req.body.message,
      req.body.route,
      0,
      req.body.states,
      '',
      ''
    )
    if (responseCreated) {
      res.json({ status: "success", message: "Message Updated!!!", data: { messages: responseCreated } })
    }
  },
  //Metodo para eliminar algun registro de la base de datos por ID
  deleteById: function (req, res, next) {
    let responseCreated = deleteMessage(
      req.params.messageId
    )
    if (responseCreated) {
      res.json({ status: "success", message: "Message deleted!!!", data: { messages: responseCreated } })
    }
  },
  //Metodo para crear algun registro nuevo
  create: function (req, res, next) {
    let responseCreated = createMessage(
      req.body.message,
      req.body.route,
      0,
      req.body.states,
      '',
      ''
    )
    if (responseCreated) {
      res.json({ status: "success", message: "Message created!!!", data: { messages: responseCreated } })
    }
  },
}