import React, {Component} from 'react';
import TopBar from './Top-bar'
import Feed from './Feed';

class Home extends Component {
  render() {
    return (
      <div>
        <TopBar title="Top Stories"></TopBar>
        <Feed></Feed>
      </div>
    );
  }
}

export default Home;
