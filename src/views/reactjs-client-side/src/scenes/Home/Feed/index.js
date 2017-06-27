import React, {Component} from 'react';
import './Feed.css';
import TopStoriesService from '../../../services/Top-Stories.service.js'

var me;

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storyCards: null
    }
    me = this;
  }
  render() {
    return (
      <ul className="story-cards-container"></ul>
    );
  }

  componentDidMount() {
    TopStoriesService.get(function(stories) {
      me.setState({storyCards: stories});
    });

  }
}

export default Feed;
