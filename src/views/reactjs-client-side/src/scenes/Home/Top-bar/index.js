import React, {Component} from 'react';
import './Top-bar.css';

class TopBar extends Component {
  render() {
    return (
      <div className="app-bar">
        <a className="btn left"></a>
        <a className="btn right">
          <i className="material-icons">cached</i>
        </a>
        <span className="title">Top Stories</span>
      </div>
    );
  }
}

export default TopBar;
