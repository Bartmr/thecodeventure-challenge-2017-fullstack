import request from 'superagent';

var stories;

const TopStoriesInterface = {
  get: function(component, callback) {
    if (!stories) {
      this.refresh(component, callback);
    } else {
      callback.call(component, stories);
    }
  },
  refresh: function(component, callback) {
    request.get('/top-stories').end(function(err, res) {
      if (err && err.status === 401) {
        window.location.href = window.location.protocol + '//' + window.location.hostname + "/login";
      } else if (err) {
        alert(err);
      } else {
        stories = res.body
        callback.call(component, stories);
      }
    })
  }
}

export default TopStoriesInterface;
