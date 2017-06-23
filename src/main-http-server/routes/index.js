const https = require('https');

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
    path: '/hacker-news-top-stories',
    handler: function hackerNewsTopStoriesHandler(request, reply) {

      // https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty

      var hackerNewsReq = https.get({
        host: 'hacker-news.firebaseio.com',
        path: '/v0/topstories.json?print=pretty',
        method: 'GET'
      }, function(hackerNewsRes) {

        var payloadToSend = '';

        hackerNewsRes.setEncoding('utf8');

        hackerNewsRes.on('data', function(data) {
          payloadToSend += data;
        });

        hackerNewsRes.on('end', function(data) {
          reply(payloadToSend);
        });

      }).on('error', (e) => {
        reply('Error getting HackerNews post ID arrays: ' + JSON.stringify(e)).code(500);
      }).end();

    }

    // config: {
    //   auth: 'session'
    // }
  }
]
