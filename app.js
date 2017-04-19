const server = require('./server');

const port = process.env.PORT || 8080;

const app = server.app();
app.listen(port);
