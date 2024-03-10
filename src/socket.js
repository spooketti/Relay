var socket = io("http://127.0.0.1:6221/");  // Connect to the SocketIO server

        socket.on('connect', function() {
            console.log('Connected to server');
        });

        socket.on('disconnect', function() {
            console.log('Disconnected from server');
        });

        socket.on('response', function(data) {
            console.log("abc")
        });