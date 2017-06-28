import React, {Component} from 'react';
import './Top-bar.css';

class TopBar extends Component {
  render() {
    return (
      <div className="app-bar">
        <a className="btn left"></a>
        <a className="btn right"></a>
        <span className="title">{this.props.title}</span>
      </div>
    );
  }
}

export default TopBar;
