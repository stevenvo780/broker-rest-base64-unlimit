const csv = require('csv-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
// Cargamos el módulo de bcrypt
const bcrypt = require('bcrypt');
// Cargamos el módulo de jsonwebtoken
const jwt = require('jsonwebtoken');

module.exports = {
  create: function (req, res, next) {
    let data = []
    fs.createReadStream('./users.csv')
      .pipe(csv())
      .on('data', function (row) {
        data.push(row)
      })
      .on('end', () => {
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        const csvWriter = createCsvWriter({
          path: 'users.csv',
          header: [
            { id: '_id', title: '_id' },
            { id: 'nombre', title: 'nombre' },
            { id: 'email', title: 'email' },
            { id: 'password', title: 'password' },
          ]
        });
        let id = uuidv4()
        let dataResponse = [];
        let error = false;
        data.forEach(user => {
          if (user.email == req.body.email) {
            error = true;
          }
        });
        if (!error) {
          let password = bcrypt.hashSync(req.body.password, 10)
          data.push({
            _id: id,
            nombre: req.body.nombre,
            email: req.body.email,
            password: password,
          })

          dataResponse.push({
            _id: id,
            nombre: req.body.nombre,
            email: req.body.email,
            password: password,
          })

          csvWriter
            .writeRecords(data)
            .then(() => res.json({ status: "success", message: "Usuario agregado exitosamente!!!", data: { messages: dataResponse } }));
        } else {
          res.json({ status: "success", message: "Ya existe un usuario con este correo", data: { messages: dataResponse } })
        }

      });
  },
  authenticate: function (req, res, next) {
    let data = []
    fs.createReadStream('./users.csv')
      .pipe(csv())
      .on('data', function (row) {
        data.push(row)
      })
      .on('end', () => {
        let Users = []
        data.forEach(user => {
          if (user.email == req.body.email) {
            Users.push(user)
            userInfo = user
            if (userInfo) {
              if (req.body.password) {
                if (bcrypt.compareSync(req.body.password, userInfo.password)) {
                  const token = jwt.sign({ id: userInfo._id }, req.app.get('secretKey'), { expiresIn: '1h' });
                  res.json({ status: "Ok", message: "El usuario ha sido autenticado!!!", data: { user: userInfo, token: token } });
                } else {
                  res.json({ status: "error", message: "Invalid email/password!!", data: null });
                }
              } else {
                res.json({ status: "error", message: "Invalid data request", data: null });
              }
            } else {
              res.json({ status: "error", message: "User not register", data: null });
            }
          }
        });
      });
  },
}