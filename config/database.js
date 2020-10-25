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
      //console.log('CSV file successfully processed');
      messages.push(data)
      readStream.destroy();
    })
    .on('close', function () {
      //console.log("close");
      return messages
    });
}
fs.watch("./messages.csv", (eventType, filename) => {
  /* console.log("\nThe file", filename, "was modified!");
  console.log("The type of change was:", eventType); */
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
      { id: '_id', title: '_id' },
      { id: 'message', title: 'message' },
      { id: 'route', title: 'route' },
      { id: 'tried', title: 'tried' },
      { id: 'states', title: 'states' },
      { id: 'response_message', title: 'response_message' },
      { id: 'http_code_response', title: 'http_code_response' },
    ]
  });

  messages[0].forEach(messageData => {
    if (messageData._id == id) {
      messageData.message = message
      messageData.route = route
      messageData.tried = tried
      messageData.states = states
      messageData.response_message = response_message
      messageData.http_code_response = http_code_response
    }
  });

  const dataResponse = {
    _id: id,
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
  let id = uuidv4()
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

  messages[0].push({
    _id: id,
    message: message,
    route: route,
    tried: tried,
    states: states,
    response_message: response_message,
    http_code_response: http_code_response
  })

  const dataResponse = {
    _id: id,
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

function deleteMessage(id) {
  getMessages()
  const csvWriter = createCsvWriter({
    path: './messages.csv',
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
  messages[0].forEach(function (messageData, key) {
    if (messageData._id == id) {
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
