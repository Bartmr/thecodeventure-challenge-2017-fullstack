const https = require('https');
const areArraysEqual = require('../utils/are-arrays-equal.js');

var topStoriesIds = [];
var topStoriesContents = [];

// Stop signalss to make the requests wait for info to be fetched only one time.
const stopSignals = {
  isFetchingTopStoryIds: false,
  isPopulatingTopStories: false
}

var errorInStoryContentPopulation = false;

var replyCallbacksQueue = [];

module.exports = {
  replyTopStories: function getTopStoriesContents(request, replyCallback) {
    if (stopSignals.isFetchingTopStoryIds || stopSignals.isPopulatingTopStories) {
      replyCallbacksQueue.push(replyCallback);
    } else {
      // Time to pause all requests till the Ids are refreshed
      replyCallbacksQueue.push(replyCallback);
      stopSignals.isFetchingTopStoryIds = true;

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
            runReplyCallbacksQueue('isFetchingTopStoryIds', topStoriesContents);
          } else {
            // Top stories are not refreshed, is time to pause the requests
            stopSignals.isPopulatingTopStories = true;
            stopSignals.isFetchingTopStoryIds = false;
            topStoriesContents = [];
            for (var i = 0; i < newlyFetchedTopStoriesIds.length; i++) {
              fetchStoryContentAndPopulateCache(i, newlyFetchedTopStoriesIds);
            }
          }

        });
      }).on('error', (e) => {

        runReplyCallbacksQueue('isFetchingTopStoryIds', 'Error', 500);

      }).end();

    }
  }
}

function runReplyCallbacksQueue(task, payload, errorCode) {

  while (replyCallbacksQueue.length != 0) {
    var reply = replyCallbacksQueue.shift();
    if (!errorCode) {
      reply(payload);
    } else {
      reply(payload).code(errorCode);
    }
  }
  stopSignals[task] = false;
}

function fetchStoryContentAndPopulateCache(i, newlyFetchedTopStoriesIds) {
  https.get({
    host: 'hacker-news.firebaseio.com',
    path: '/v0/item/' + newlyFetchedTopStoriesIds[i] + '.json?print=pretty',
    method: 'GET'
  }, function fetchAndPopulateTopStories(contentResponse) {
    var storyContentResponseData = '';
    contentResponse.setEncoding('utf8');
    contentResponse.on('data', function(data) {
      storyContentResponseData += data;
    });
    contentResponse.on('end', function(data) {
      if (!errorInStoryContentPopulation) {
        topStoriesContents.push(JSON.parse(storyContentResponseData));
        if (i == newlyFetchedTopStoriesIds.length - 1) {
          topStoriesIds = newlyFetchedTopStoriesIds;
          topStoriesContents.sort(function(a, b) {
            return b.score - a.score;
          })
          runReplyCallbacksQueue('isPopulatingTopStories', topStoriesContents);
          errorInStoryContentPopulation = false;
        }
      }
    });
  }).on('error', (e) => {
    // Reset cache, has it can be corrupted with half the entries filled
    topStoriesIds = [];
    topStoriesContents = [];
    errorInStoryContentPopulation = true;
    runReplyCallbacksQueue('isPopulatingTopStories', 'Error', 500);
  }).end();
}
