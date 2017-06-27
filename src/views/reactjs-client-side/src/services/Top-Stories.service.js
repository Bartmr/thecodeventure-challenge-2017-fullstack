import request from 'superagent';

var stories;

const TopStoriesInterface = {
  get: function(callback) {
    if (!stories) {
      this.refresh(callback);
    } else {}
  },
  refresh: function(callback) {
    request.get('/top-stories').end(function(err, res) {
      if (err && err.status === 401) {
        window.location.href = window.location.protocol + '//' + window.location.hostname + "/login";
      } else if (err) {
        alert(err);
      } else {
        callback(res.body);
      }
    })
  }
}

export default TopStoriesInterface;
