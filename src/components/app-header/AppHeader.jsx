import React from "react";
import logo from "../../images/logo.svg";

const AppHeader = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">
          Welcome to Travel Tool
        </h1>
      </header>
    </div>
  );
};
export default AppHeader;
