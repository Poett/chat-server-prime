var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
const chat = io.of("/chat");


app.use(express.static("webfiles"));

app.get('/', (req, res) => 
{
    res.send('Index');
});

app.get('/chat', (req, res) => 
{
    res.sendFile(__dirname + "/chat.html");
});


io.on('connection', (socket) => 
{
    console.log('client connected to index');
});

chat.on('connection', (socket) =>
{
    socket.join('chat');

    chat.clients((error, clients ) => 
    {
        if (error) throw error;
        console.log(clients);
    });

    console.log("Client " + socket.id + " entered chat");

    socket.on('disconnect', () =>
    {
        console.log('user disconnected');
    });

    socket.on('chat message', (msg) =>
    {
        console.log('message: ', msg);
        chat.to('chat').emit("chat message", msg, socket.id);
    })
});

http.listen(process.env.PORT || 8080);
