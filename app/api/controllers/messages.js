const csv = require('csv-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  // Metodo para la busqueda de videojuegos por ID
  getById: function (req, res, next) {
    let data = []
    fs.createReadStream('./messages.csv')
      .pipe(csv())
      .on('data', function (row) {
        data.push(row)
      })
      .on('end', () => {
        let oneMessage = []
        data.forEach(message => {
          if (message._id == req.params.messageId) {
            oneMessage.push(message)
          }
        });
        if (oneMessage.length > 0) {
          res.json({ status: "success", message: "Message found!!!", data: { messages: oneMessage } });
        } else {
          res.json({ status: "success", message: "Message not found", data: { messages: [] } });
        }
      });
  },
  //Metodo para retornar todos los videojuegos registrados en la base de datos
  getAll: function (req, res, next) {
    let data = []
    fs.createReadStream('./messages.csv')
      .pipe(csv())
      .on('data', function (row) {
        data.push(row)
      })
      .on('end', () => {
        if (data.length > 0) {
          res.json({ status: "success", message: "Message found!!!", data: { messages: data } });
        } else {
          res.json({ status: "success", message: "Message not found", data: { messages: [] } });
        }
      });
  },
  //Metodo para actualizar algun registro de la base de datos por ID
  updateById: function (req, res, next) {
    let data = []

    fs.createReadStream('./messages.csv')
      .pipe(csv())
      .on('data', function (row) {
        data.push(row)
      })
      .on('end', () => {
        let dataEdit = [];
        data.forEach(message => {
          if (message._id == req.params.messageId) {
            message.message = req.body.message
            message.route = req.body.route
            message.tried = req.body.tried
            message.states = req.body.states
            message.response_message = req.body.response_message
            message.http_code_response = req.body.http_code_response
            dataEdit.push(message)
          }
        });
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        const csvWriter = createCsvWriter({
          path: 'messages.csv',
          header: [
            { id: '_id', title: '_id' },
            { id: 'message', title: 'message' },
            { id: 'route', title: 'route' },
            { id: 'tried', title: 'tried' },
            { id: 'states', title: 'states' },
            { id: 'response_message', title: 'response_message' },
            { id: 'http_code_response', title: 'http_code_response' },
          ]
        });
        let dataResponse = [];

        dataResponse.push({
          _id: req.params.messageId,
          message: req.body.message,
          route: req.body.route,
          tried: 0,
          states: req.body.states,
          response_message: '',
          http_code_response: ''
        })

        csvWriter
          .writeRecords(data)
          .then(() => res.json({ status: "success", message: "Message update successfully", data: { messages: dataResponse } }));

      });
  },
  //Metodo para eliminar algun registro de la base de datos por ID
  deleteById: function (req, res, next) {
    let data = []
    console.log(req.params.messageId)
    fs.createReadStream('./messages.csv')
      .pipe(csv())
      .on('data', function (row) {
        data.push(row)
        console.log(row);
      })
      .on('end', () => {
        data.forEach(function (message, key) {
          if (message._id == req.params.messageId) {
            delete data[key]
          }
        });
        let dataSave = []
        data.forEach(function (message, key) {
          dataSave.push(message)
        });
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        const csvWriter = createCsvWriter({
          path: 'messages.csv',
          header: [
            { id: '_id', title: '_id' },
            { id: 'message', title: 'message' },
            { id: 'route', title: 'route' },
            { id: 'tried', title: 'tried' },
            { id: 'states', title: 'states' },
            { id: 'response_message', title: 'response_message' },
            { id: 'http_code_response', title: 'http_code_response' },
          ]
        });
        csvWriter
          .writeRecords(dataSave)
          .then(() => res.json({ status: "success", message: "Message deleted successfully!!!", data: { messages: null } }));

      });
  },
  //Metodo para crear algun registro nuevo
  create: function (req, res, next) {
    let data = []
    fs.createReadStream('./messages.csv')
      .pipe(csv())
      .on('data', function (row) {
        data.push(row)
      })
      .on('end', () => {
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        const csvWriter = createCsvWriter({
          path: 'messages.csv',
          header: [
            { id: '_id', title: '_id' },
            { id: 'message', title: 'message' },
            { id: 'route', title: 'route' },
            { id: 'tried', title: 'tried' },
            { id: 'states', title: 'states' },
            { id: 'response_message', title: 'response_message' },
            { id: 'http_code_response', title: 'http_code_response' },
          ]
        });
        let id = uuidv4()
        let dataResponse = [];
        data.push({
          _id: id,
          message: req.body.message,
          route: req.body.route,
          tried: 0,
          states: req.body.states,
          response_message: '',
          http_code_response: ''
        })

        dataResponse.push({
          _id: id,
          message: req.body.message,
          route: req.body.route,
          tried: 0,
          states: req.body.states,
          response_message: '',
          http_code_response: ''
        })

        csvWriter
          .writeRecords(data)
          .then(() => res.json({ status: "success", message: "Message created!!!", data: { messages: dataResponse } }));

      });
  },
}