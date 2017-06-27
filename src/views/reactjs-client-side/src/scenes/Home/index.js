import React, {Component} from 'react';
import TopBar from './Top-bar'
import Feed from './Feed';

class Home extends Component {
  render() {
    return (
      <div>
        <TopBar></TopBar>
        <Feed></Feed>
      </div>
    );
  }
}

export default Home;
