/*
global.fetch = require('node-fetch')
global.Headers = fetch.Headers;
const messageModel = require('./app/api/models/messages');
async function getMessages() {
  await messageModel.find({ states: "wait" }, function (err, messages) {
    if (err) {
      console.error(err);
    } else {
      messages.forEach(function (message, key) {
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
              let pr =  fetch(route.uri, {
                method: 'POST',
                body: JSON.parse(message.message),
                headers: myHeaders,
              })
              TimeoutPromise(pr, process.env.TIME_OUT_REQUEST)
                .then(response => response.json())
                .then(function (data) {
                  console.log(data);
                  messageModel.findByIdAndRemove(message._id, function (err, messageInfo) {
                    if (err) {
                      console.error(err);
                    }
                    if (messageInfo) {
                      delete messages[key]
                      //console.error("Borrado correctamente");
                    }
                  });
                })
                .catch(function (err) {
                  console.error(err);
                  let intento = message.tried + 1;
                  messageModel.findByIdAndUpdate(message._id, {
                    message: message.message,
                    route: message.route,
                    tried: intento,
                    states: "wait",
                    response_message: err,
                    http_code_response: 500,
                  }, function (err, messageInfo) {
                    if (err) {
                      console.error(err);
                    }
                    if (messageInfo) {
                      //console.error(messageInfo);
                    }
                  });
                });
            }
          }
        } else {
          messageModel.findByIdAndRemove(message._id, function (err, messageInfo) {
            if (err) {
              console.error(err);
            }
            if (messageInfo) {
              delete messages[key]
              //console.error("Borrado correctamente");
            }
          });
        }
      });
    }
  });
}
*/
setInterval(() => {
  //getMessages()
}, process.env.UPDATE_FREQUENCY);

