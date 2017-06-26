const https = require('https');
const areArraysEqual = require('../utils/are-arrays-equal.js');

var topStoriesIds = [];
var topStoriesContents = [];

// Stop signs to make the requests wait for info to be fetched only one time.
var isFetchingTopStoryIds = false;
var isPopulatingTopStories = false;

var errorInStoryContentPopulation = false;

var replyCallbacksQueue = [];

module.exports = {
  replyTopStories: function getTopStoriesContents(request, replyCallback) {
    if (isFetchingTopStoryIds || isPopulatingTopStories) {
      replyCallbacksQueue.push(replyCallback);
    } else {
      // Time to pause all requests till the Ids are refreshed
      replyCallbacksQueue.push(replyCallback);
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
            runReplyCallbacksQueue('isFetchingTopStoryIds', topStoriesContents);
          } else {
            // Top stories are not refreshed, is time to pause the requests
            isPopulatingTopStories = true;
            isFetchingTopStoryIds = false;

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
  if (task == 'isFetchingTopStoryIds') {
    isFetchingTopStoryIds = false;
  } else {
    isPopulatingTopStories = false;
  }
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
