import React from "react";
import ReactDOM from "react-dom";
import Profile from "./profile";

// this funtion contains sub funtionalities to return final view of signup page
function View() {
  return (
    <>
      <Profile />
    </>
  );
}

// rendering final view of signup page to index.html
ReactDOM.render(<View />, document.getElementById("root"));