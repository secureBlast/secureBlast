import React from "react";
import ReactDOM from "react-dom";
import Login from "./login";

// this funtion contains sub funtionalities to return final view of login page
function View() {
  return (
    <>
      <Login />
    </>
  );
}

// rendering final view of login page to index.html
ReactDOM.render(<View />, document.getElementById("root"));