const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5174",  // Please set this url according to the url of your frontend
  },
});

let crudData = [];
let playerScores = [];

io.on("connection", (socket) => {
  socket.on("scores", (scores) => {
    playerScores.push({ ...scores, id: socket.id });

    socket.emit("playerScores", playerScores);

    setInterval(() => {
      socket.emit("playerScores", playerScores); // We have to emit the player scores back to our client
    }, 5000);
  });

  socket.on("data", (data) => {
    crudData.push(data);

    socket.emit("crudData", crudData);
  });

  socket.on('editData',(response) => {
    console.log(response);
    let currentIndex = crudData.findIndex((data) => data.id === response.id)
    if (currentIndex != -1) {
      crudData[currentIndex] = {...crudData[currentIndex],...response}
    }
  })

  socket.on('deleteData',(id) => {
    let currentIndex = crudData.findIndex((data) => data.id === id)
    if(currentIndex != -1) {
      crudData.splice(currentIndex,1);
    }
  })

  setInterval(() => {
    socket.emit("crudData", crudData);

  }, 1000);
});

httpServer.listen(3000, () => {
  console.log("Server is Connected");
});
