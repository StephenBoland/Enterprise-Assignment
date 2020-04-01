//imports

const app = require("../backend/app");
const debug = require("debug")("node-angular"); //Requires for nodemon (so server autorefreshes)
const http = require("http");

//When trying to setup a port, make sure its a valid number and the use it.
const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number is valid
    return port;
  }

  return false;
};
//checking what type of error occurs
const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};
//output that we listen to requests
const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};
//Setting normalizeport function and looking for env variable ports or setting to port 3000
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);
//setup the node server, use error handlers and listener.
const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
//start the server
server.listen(port);
