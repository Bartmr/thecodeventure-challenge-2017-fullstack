import React, {Component} from 'react';
import './App-bar.css';

class AppBar extends Component {
  render() {
    return (
      <div className="app-bar">
        <a className="btn left"></a>
        <a className="btn right">
          <i className="material-icons">cached</i>
        </a>
        <span className="title">Home</span>
      </div>
    );
  }
}

export default AppBar;
