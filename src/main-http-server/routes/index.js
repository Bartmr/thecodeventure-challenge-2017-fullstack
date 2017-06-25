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
    path: '/top-stories',
    handler: function topStoriesHandler(request, reply) {

      // https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty

      https.get({
        host: 'hacker-news.firebaseio.com',
        path: '/v0/topstories.json?print=pretty',
        method: 'GET'
      }, function(hackerNewsRes) {

        var newlyFetchedRootItemsIds = '';

        hackerNewsRes.setEncoding('utf8');

        hackerNewsRes.on('data', function(data) {
          newlyFetchedRootItemsIds += data;
        });

        hackerNewsRes.on('end', function(data) {
          newlyFetchedRootItemsIds = JSON.parse(newlyFetchedRootItemsIds);
        });

      }).on('error', (e) => {
        reply('Error getting Hacker News root items ids: ' + JSON.stringify(e)).code(500);
      }).end();

    }
    // config: {
    //   auth: 'session'
    // }
  }

]
