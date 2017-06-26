const topStoriesHandler = require('../handlers/top-stories.handler.js');

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
    handler: topStoriesHandler.replyTopStories
    // config: {
    //   auth: 'session'
    // }
  }
]
