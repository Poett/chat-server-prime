//Express HTTP Setup 
var express = require('express');
var app = express();
var http = require('http').Server(app);

//Socket.IO Setup
var io = require('socket.io')(http);
const chat = io.of("/chat"); //create namespace '/chat'
var clientCount = 0;
let port = process.env.PORT || 8082;


app.use(express.static("webfiles")); //define a subdirectory that clients can request from

//Define HTTP GETs
app.get('/', (req, res) => 
{
    res.sendFile(__dirname + "/index.html");
});

app.get('/chat', (req, res) => 
{
    console.log(req.username);
    res.sendFile(__dirname + "/chat.html");
});

//Define and load Socket.IO connection events

//host domain
io.on('connection', (socket) => 
{
    console.log('client connected');
});

//chat namespace
chat.on('connection', (socket) =>
{
    socket.join('general'); //join room 'general' within '/chat'
	
	clientCount = clientCount + 1;
	socket.clientNumber = clientCount;

    console.log("Client " + socket.clientNumber + " entered chat");

	//Define disconnect event - reserved event from socket.io library
    socket.on('disconnect', () =>
    {
        console.log('user disconnected');
    });

	//Define a 'chat message' event
    socket.on('chat message', (msg) =>
    {
        let label = "Client " + socket.clientNumber + ": ";
        console.log(label, msg);
		
		//broadcast to all clients in '/chat', room 'general'
        chat.to('general').emit("chat message", msg, label); 
    })
});


//Begin listening after everything defined
http.listen(port, () => 
{
    console.log(`Listening on port ${port}`);
});