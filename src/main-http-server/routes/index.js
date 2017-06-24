const https = require('https');

const itemsTreeCache = {};

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

      var hackerNewsReq = https.get({
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
          diffPopulateWithContentRepeat(itemsTreeCache, newlyFetchedRootItemsIds);
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

function diffPopulateWithContentRepeat(itemsTreeNode, newlyFetchedItemsIds) {
  // Check what items were deleted since last fetch
  // Due to async stuff, variables will be generated inside for loops
  for (item of itemsTreeNode) {
    var itemsIdsToDelete = [];
    if (newlyFetchedItemsIds.indexOf(item.id) < 0) {
      itemsToDelete.push(item.id);
    }
  }
  // Delete the differencial
  for (itemId of itemsIdsToDelete) {}
}
