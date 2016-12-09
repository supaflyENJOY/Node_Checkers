var net = require('net');

var HOST = '0.0.0.0';
var PORT = 6969;

var MessageType = {
	Move: 0,
	Remove: 1,
	Clear: 2,
	StartGame: 3,
	EndGame: 4,
	ChangeTeam: 5,
	ChangeState: 6
};

process.on('uncaughtException', function (err) {
	console.error(err.stack);
});


var q = [];

var rooms = [];

var lastId = 0;

function buildMessage() {
	return String.fromCharCode.apply(null, Array.prototype.slice.call(arguments, 0));
}

function createRoom(i) {
	console.log("Creating room for two players");
	rooms[i].p[0].write(buildMessage(MessageType.StartGame));
	rooms[i].p[1].write(buildMessage(MessageType.StartGame));
	rooms[i].p[0].write(buildMessage(MessageType.ChangeTeam, 1));
	rooms[i].p[1].write(buildMessage(MessageType.ChangeTeam, 2));
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
		rooms.forEach(function(r) {
			if(r.p[0] == sock) r.p[1].write(data);
			else if(r.p[1] == sock) r.p[0].write(data);
		});
    });
	
    sock.on('close', function(data) {
		if(q.indexOf(sock) >= 0) q.splice(q.indexOf(sock), 1);
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);