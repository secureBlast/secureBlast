import React from "react";
import ReactDOM from "react-dom";
import Signup from "./signup";

// this funtion contains sub funtionalities to return final view of signup page
function View() {
  return (
    <>
      <Signup />
    </>
  );
}

// rendering final view of signup page to index.html
ReactDOM.render(<View />, document.getElementById("root"));