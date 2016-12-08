var net = require('net');

var HOST = '0.0.0.0';
var PORT = 6969;

process.on('uncaughtException', function (err) {
	console.error(err.stack);
});


var q = [];

var rooms = [];

var lastId = 0;

function createRoom(i) {
	console.log("Creating room for two players");
	rooms[i].p[0].write("newgame");
	rooms[i].p[1].write("newgame");
}

net.createServer(function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
	
	q.push(sock);	
	
	
	console.log("Adding player to queue...");
	
	if(q.length >= 2) {
		rooms.push({p: [q[0], q[1]]});
		createRoom(rooms.length-1);
		q.splice(0,2);
	}
	
    sock.on('data', function(data) {
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        sock.write('You said "' + data + '"');
    });
	
    sock.on('close', function(data) {
		
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);