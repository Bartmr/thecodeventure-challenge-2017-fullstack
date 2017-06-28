import React, {Component} from 'react';
import './Feed.css';
import TopStoriesService from '../../../services/Top-Stories.service.js'
import TimeAgo from 'time-ago'

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      storyCards: null
    }
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
    TopStoriesService.get(this, function(stories) {
      this.setState({
        loading: false,
        storyCards: stories.map(function(story, index) {
          if (story.kids) {
            story.ammountOfComments = story.kids.length;
          }
          return <li key={index} className='story-card'>
            <a href="">
              <h3>{story.title}</h3>
            </a>
            <label className="bottom-label">{story.score + ' points | ' + (story.ammountOfComments || 0) + ' comments | ' + 'date' + ' by ' + story.by}</label>
          </li>
        })
      });
    });

  }
}

export default Feed;
