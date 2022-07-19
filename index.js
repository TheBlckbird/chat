let WebSocketServer = require("websocketserver")
const fs = require('fs')


let server = new WebSocketServer("all", 9000);

let messages = []

fs.readFile('messages.json', 'utf8', (err, data) => {

    if (err) {
        console.error(err)
    } else {
        messages = JSON.parse(data) 
    }

});



let connectionList = []
server.on("connection", function(id) {
    connectionList.push(id)

    let mess = ""

    for(i = 0; i < messages.length; i++) {
        if (i < messages.length - 1) {
            mess += messages[i] + "<br>"
        } else {
            mess += messages[i]
        }
    }


    server.sendMessage("one", mess, id)
})

server.on("message", function(data, id) {
    let mes = server.unmaskMessage(data)
    let str = server.convertToString(mes.message)
    messages.push(str)
    let daten = JSON.stringify(messages);
    fs.writeFile('messages.json', daten, (err) => {
        if (err) {
            console.error(err)
        }
    })

    server.sendMessage(str)
})

server.on("closedconnection", function(id) {
    connectionList.splice(connectionList.indexOf(id), 1)
})