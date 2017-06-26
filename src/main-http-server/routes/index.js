const topStoriesCache = require('../top-stories-cache.js');

module.exports = [

  {
    method: 'GET',
    path: '/{path*}',
    handler: {
      directory: {
        path: 'src/views/reactjs-client-side/build/',
        index: true
      }
    },
    config: {
      auth: false
    }
  }, {
    method: 'GET',
    path: '/top-stories',
    handler: function topStoriesHandler(request, reply) {
      topStoriesCache.get(reply);
    }
    // config: {
    //   auth: 'session'
    // }
  }
]
