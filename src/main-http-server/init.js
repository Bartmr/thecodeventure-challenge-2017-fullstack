/* -- LOAD STUFF AND DEPENDENCIES FROM FILESYSTEM -- */

const fs = require('fs');
const hapi = require('hapi');
const bell = require('bell');
const inert = require('inert');
const hapiAuthCookie = require('hapi-auth-cookie');

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
  }, {
    register: bell
  }, {
    register: hapiAuthCookie
  }
], function pluginsRegisterCallback(err) {
  if (err) {
    console.log(err);
  } else {

    server.auth.strategy('session', 'cookie', {
      cookie: 'sid',
      password: config.hapiAuthCookie.passwordEncryption,
      redirectTo: false
    });

    server.auth.strategy('github', 'bell', {
      provider: 'github',
      password: config.githubOAuth.password,
      clientId: config.githubOAuth.clientId,
      clientSecret: config.githubOAuth.clientSecret
    });

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
