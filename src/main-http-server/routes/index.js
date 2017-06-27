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
    method: [
      'GET', 'POST'
    ],
    path: '/login',
    config: {
      // Use the 'oauth' auth strategy to allow bell to handle the oauth flow.
      auth: 'github',
      handler: function loginHandler(request, reply) {
        // Here we take the profile that was kindly pulled in
        // by bell and set it to our cookie session.
        // This will set the cookie during the redirect and
        // log them into your application.

        request.cookieAuth.set(request.auth.credentials.profile);

        // User is now logged in, redirect them to their account area
        reply.redirect('/');

      }
    }
  }, {
    method: 'GET',
    path: '/top-stories',
    handler: topStoriesHandler.replyTopStories,
    config: {
      auth: 'session'
    }
  }
]
