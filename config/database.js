const csv = require('csv-parser');
const fs = require('fs');
const messages = []
const { v4: uuidv4 } = require('uuid');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
getMessages()
function getMessages() {
  let data = [];
  var readStream = fs.createReadStream("./messages.csv")
    .pipe(csv())
    .on('data', (row) => {
      data.push(row)
    })
    .on('end', () => {
      messages.push(data)
      readStream.destroy();
    })
    .on('close', function () {
      return messages
    });
}
fs.watch("./messages.csv", (eventType, filename) => {
  getMessages()
});

function editMessage(
  id,
  message,
  route,
  tried,
  states,
  response_message,
  http_code_response,
) {

  const csvWriter = createCsvWriter({
    path: 'messages.csv',
    header: [
      { id: 'id', title: 'id' },
      { id: 'message', title: 'message' },
      { id: 'route', title: 'route' },
      { id: 'tried', title: 'tried' },
      { id: 'states', title: 'states' },
      { id: 'response_message', title: 'response_message' },
      { id: 'http_code_response', title: 'http_code_response' },
    ]
  });

  messages[0].forEach(messageData => {
    if (messageData.id == id) {
      messageData.message = message
      messageData.route = route
      messageData.tried = tried
      messageData.states = states
      messageData.response_message = response_message
      messageData.http_code_response = http_code_response
    }
  });

  const dataResponse = {
    id: id,
    message: message,
    route: route,
    tried: tried,
    states: states,
    response_message: response_message,
    http_code_response: http_code_response
  }

  csvWriter
    .writeRecords(messages[0])
    .then(() => console.log('The CSV file was written successfully'));
  return dataResponse
}

function createMessage(
  message,
  route,
  tried,
  states,
  response_message,
  http_code_response,
) {
  const csvWriter = createCsvWriter({
    path: 'messages.csv',
    header: [
      { id: 'id', title: 'id' },
      { id: 'message', title: 'message' },
      { id: 'route', title: 'route' },
      { id: 'tried', title: 'tried' },
      { id: 'states', title: 'states' },
      { id: 'response_message', title: 'response_message' },
      { id: 'http_code_response', title: 'http_code_response' },
    ]
  });

  const dataResponse = {
    id: uuidv4(),
    message: message,
    route: route,
    tried: tried,
    states: states,
    response_message: response_message,
    http_code_response: http_code_response
  }
  messages[0].push(dataResponse)

  csvWriter
    .writeRecords(messages[0])
    .then(() => console.log('The CSV file was written successfully'));
  return dataResponse

}

function deleteMessage(id) {
  const csvWriter = createCsvWriter({
    path: './messages.csv',
    header: [
      { id: 'id', title: 'id' },
      { id: 'message', title: 'message' },
      { id: 'route', title: 'route' },
      { id: 'tried', title: 'tried' },
      { id: 'states', title: 'states' },
      { id: 'response_message', title: 'response_message' },
      { id: 'http_code_response', title: 'http_code_response' },
    ]
  });
  messages[0].forEach(function (messageData, key) {
    if (messageData.id == id) {
      delete messages[0][key]
    }
  });
  let dataSave = []
  messages[0].forEach(function (message, key) {
    dataSave.push(message)
  });
  csvWriter
    .writeRecords(dataSave)
    .catch((err) => console.log(err));
  return true
}

module.exports = {
  updateMessages: getMessages,
  Messages: messages,
  createMessage: createMessage,
  editMessage: editMessage,
  deleteMessage: deleteMessage,
}
