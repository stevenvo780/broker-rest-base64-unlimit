
global.fetch = require('node-fetch')
global.Headers = fetch.Headers;
const { Messages, editMessage, deleteMessage } = require('./config/database')

async function getMessages() {
  const messages = Messages[0]
  if (messages.length > 0) {
    messages.forEach(function (message, key) {
      if (message.id == "") {
        deleteMessage(message.id)
      }
      if (message.tried <= process.env.MAXIMUM_ATTEMPTS_MESSAGES) {
        if (message.route) {
          let route = JSON.parse(message.route)
          var myHeaders = new Headers();
          route.headers.forEach(header => {
            myHeaders.append(header[0], header[1]);
          });
          if (message.message) {
            const TimeoutPromise = (pr, timeout) =>
              Promise.race([pr, new Promise((_, rej) =>
                setTimeout(rej, timeout)
              )]);
            let pr = fetch(route.uri, {
              method: 'POST',
              body: JSON.parse(message.message),
              headers: myHeaders,
            })
            let tlb = TimeoutPromise(pr, process.env.TIME_OUT_REQUEST)
              .then(response => response.json())
              .then(function (data) {
                console.log(data)
                let responseCreated = deleteMessage(
                  message.id
                )
                if (responseCreated) {
                  //console.log(responseCreated)
                }
              })
              .catch(function (err) {
                let intento = message.tried + 1;
                let responseCreated = editMessage(
                  req.params.messageId,
                  message.message,
                  message.message,
                  intento,
                  "wait",
                  err,
                  500
                )
                if (responseCreated) {
                  res.json({ status: "success", message: "Message Updated!!!", data: { messages: responseCreated } })
                }
              });
          }
        }
      } else {
        let responseCreated = deleteMessage(
          message.id
        )
        if (responseCreated) {
          //console.log(responseCreated)
        }
      }
    })
  }
}

setInterval(() => {
  getMessages()
}, process.env.UPDATE_FREQUENCY);

