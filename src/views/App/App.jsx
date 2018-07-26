import React, { Component } from 'react';
import './App.scss';

import { BrowserRouter } from "react-router-dom";

import Routes from "../../routes/index";

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
