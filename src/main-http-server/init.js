/* -- LOAD STUFF AND DEPENDENCIES FROM FILESYSTEM -- */

const fs = require('fs');
const hapi = require('hapi');
const inert = require('inert');

// Load the hosting parameters from the config file.
const config = require('../../config/config.js');

// Read the certificates that grant HTTPS connections
const options = {
  key: fs.readFileSync('certificates/server.key'),
  cert: fs.readFileSync('certificates/server.crt')
};

const routes = require('./routes/index.js');

/* -- -- */

// Instantiate an Hapi server
const server = new hapi.Server();
// Set the hosting parameters
server.connection({host: config.mainHttpServer.host, port: config.mainHttpServer.port, tls: options});
//

//Register plugins
server.register([
  {
    register: inert
  }
], function pluginsRegisterCallback(err) {
  if (err) {
    console.log(err);
  } else {

    // Set up the routes, that in turn set the handlers
    server.route(routes);

    // Start the server
    server.start((err) => {
      if (err) {
        throw err;
      }
      console.log('Server running at:', server.info.uri);
    });
  }
})
