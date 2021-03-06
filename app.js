var bot = require('./lib/bot')
var fs = require('fs'),
  http = require('http');

var server = http.createServer(function (req, res) {
  var filename = (req.url === "/") ? "/index.html" : req.url;
  fs.readFile(__dirname + '/public' + filename, { encoding: 'utf8' }, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200, {
      "Content-Type": "text/html"
    });
    res.end(data);
  });
}).listen(8080);

// set up the websocket server
var WebSocketServer = require('websocket').server;
var connIds = [];
var wss = new WebSocketServer({ httpServer: server });

//Connection
wss.on('request', function (request) {
  var connection = request.accept(null, request.remoteAddress);
  var cid = request.key;
  var self = this;
  connection.id = cid;
  connection.on('message', function (msg) {
    var message = msg.utf8Data;
    bot.doAction(message);
  });
});

process.on('SIGINT', function () {
  bot.destroy();
  process.exit();
});


console.log("Launch - http://IP:8080/")