import React from "react";
import ReactDOM from "react-dom";
import Reset1 from "./resert-pw1";

// this funtion contains sub funtionalities to return final view of login page
function View() {
  return (
    <>
      <Reset1 />
    </>
  );
}

// rendering final view of login page to index.html
ReactDOM.render(<View />, document.getElementById("root"));