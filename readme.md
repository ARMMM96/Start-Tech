### Before starting the server you need to make sure that the evnerioment variables are correct from

### .env file

    // Chose a port
    PORT=3000
    // Add the correct data base link
    DBURL=mongodb://127.0.0.1:27017/
    StartTech

    // Add pasword token
    tokenPassword=TokenPassowrd

In the project directory, you can run:

    npm install
    node --watch index.js

To taste the restful api's you can use this post man collection form that link

https://www.postman.com/galactic-space-9878/workspace/start-tech/collection/4987583-d42b9aa3-f556-4400-a779-5325e54795c1?action=share&creator=4987583

To taste Socket.IO channels without UI, you can use the Socket.IO client library to connect to your Socket.IO server and listen for events.

```JavaScript
const socketIO = require("socket.io-client");

const socket = socketIO("http://localhost:3000"); // Replace this with the URL of your Socket.IO server

// Listen for the "message" event
socket.on("message", (message) => {
  console.log(message);
});

// Send a message
socket.emit("message", "Hello, world!");
```

You can also use Socket.IO to join and leave rooms. For example, to join the room "room1", you would do the following:

```javascript
socket.join("room1");
```
To leave the room "room1", you would do the following:
```javascript
socket.leave("room1");
```

You can then use the to() and in() methods to emit and listen for events in specific rooms. For example, to emit a message to all clients in the room "room1", you would do the following:
```javascript
socket.to("room1").emit("message", "Hello, room1!");
```

To listen for messages in the room "room1", you would do the following:

```javascript
socket.in("room1").on("message", (message) => {
  console.log(message);
});

```