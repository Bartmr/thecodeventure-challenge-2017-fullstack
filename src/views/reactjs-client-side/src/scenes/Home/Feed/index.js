import React, {Component} from 'react';
import './Feed.css';
import TopStoriesService from '../../../services/Top-Stories.service.js'

var me;

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      storyCards: null
    }
    me = this;
  }
  render() {
    if (this.state.loading) {
      return (
        <h2 className="loading-message">Fetching Stories...</h2>
      )
    } else {
      return (
        <ul className="story-cards-container">{this.state.storyCards}</ul>
      );
    }
  }

  componentDidMount() {
    TopStoriesService.get(function(stories) {
      console.log(stories)
      me.setState({
        loading: false,
        storyCards: stories.map((story, index) => <li key={index} className='story-card'>
          <h3>{story.title}</h3>
        </li>)
      });
    });

  }
}

export default Feed;
