if (process.env.NODE_ENV != 'production' && process.env.NODE_ENV != 'development') {
  console.log('NODE_ENV is not set correctly. NODE_ENV = ' + process.env.NODE_ENV + '\n\n-----');
  throw err;
} else {
  require('./main-http-server/init.js');
}
