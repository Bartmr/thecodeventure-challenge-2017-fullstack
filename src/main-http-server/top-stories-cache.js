const areArraysEqual = require('./utils/are-arrays-equal.js');

var topStoriesIds = [];
var topStoriesContents = [];

// Stop signs to make the requests wait for info to be fetched only one time.
var isFetchingTopStoryIds = false;
var isPopulatingTopStories = false;

var replyCallbacksQueue = [];

module.exports = {
  get: function getTopStoriesContents(replyCallback) {
    if (isFetchingTopStoryIds || isPopulatingTopStories) {
      replyCallbacksQueue.push(replyCallback);
    } else {

      isFetchingTopStoryIds = true;

      https.get({
        host: 'hacker-news.firebaseio.com',
        path: '/v0/topstories.json?print=pretty',
        method: 'GET'
      }, function fetchTopStoriesIds(topStoriesIdsResponse) {
        var newlyFetchedTopStoriesIds = '';

        topStoriesIdsResponse.setEncoding('utf8');

        topStoriesIdsResponse.on('data', function(data) {
          newlyFetchedTopStoriesIds += data;
        });

        topStoriesIdsResponse.on('end', function(data) {
          newlyFetchedTopStoriesIds = JSON.parse(newlyFetchedTopStoriesIds);

          if (areArraysEqual(topStoriesIds, newlyFetchedTopStoriesIds)) {
            runReplyCallbacksQueue(topStoriesContents);
          } else {
            // Top stories are not refreshed, is time to pause the requests

          }

        });
      }).on('error', (e) => {

        runReplyCallbacksQueue('Error', 500);

      }).end();

    }
  }
}

function runReplyCallbacksQueue(payload, errorCode) {
  var iterator = replyCallbacksQueue.entries();

  for (let n of iterator) {
    if (!errorCode) {
      n(payload);
    } else {
      n(payload).code(errorCode);
    }

  }

  // TODO: think of a way to delete replyCallbacks while iterating them
  replyCallbacksQueue = [];
  isFetchingTopStoryIds = false;
}
