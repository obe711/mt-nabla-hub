const app = require('./app');
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
const logger = require('./config/logger');

io.on('connection', (socket) => {
  logger.info('New client connected ${}');
  console.log(socket.id)
  io.emit("data", "hi")
  // logger.info(socket.id);
  // const userId = socket.decoded.sub;

  // userService.setUserOnlineById(userId);
  // getMenuNotifications(socket);

  // routeLogging(socket);
  socket.on('disconnect', () => {
    logger.info('Client disconnected');
    //userService.setUserOfflineById(userId);
  });
});

module.exports.emit = (listener, args) => {
  io.sockets.emit(listener, args);
}

module.exports.server = httpServer;