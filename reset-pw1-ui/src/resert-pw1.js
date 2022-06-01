import React, { useState, useRef } from "react";
import "./reset-pw1.css";
import "./reset-pw.scss";
import logo from "./Images/logoBlack.png";

// this function returns the csrf token for the session
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// this funtion render view for the password reset view -> email verification page
// also handle all the request and responses regarding user password reset email verivication
function Reset1() {
  // getting backend response on a successful email verification
  const sentMail = () => {
    const url =
      "http://secureblast.pythonanywhere.com/accounts/reset_password_sent/";
    const method = "GET";
    const xhr = new XMLHttpRequest();
    // xhr.responseType = "json";
    const csrftoken = getCookie("csrftoken");
    xhr.open(method, url);
    xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    // on backend response
    xhr.onload = function () {
      console.log("Data Received!");
      const resp = xhr.response;
      const sts = xhr.status;
    };
    // if internal server errors occured
    xhr.onerror = function () {
      alert("An Error Occurede!");
    };
    xhr.send();
  };

  // send user input data to backend validation (via html form)
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const url = form.getAttribute("action"); // target url
    const method = form.getAttribute("method"); // req method
    const xhr = new XMLHttpRequest();
    // xhr.responseType = "json";
    const csrftoken = getCookie("csrftoken"); // get session csrf token
    xhr.open(method, url);
    xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest"); // set security headers
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);

    // on getting backend response
    xhr.onload = function () {
      const createdUser = xhr.response;
      const status = xhr.status;
      if (status === 200) {
        alert("Email Successfully Sent!");
        form.reset();
        sentMail();
      }
    };
    // handling internal server errors
    xhr.onerror = function () {
      alert("An Error Occurede!");
    };
    xhr.send(formData);
  };
  return (
    <>
      <div className="bubbles">
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
      </div>
      <div className="container">
      <img className="logo" src={logo} alt="profile" />
        <div className="screen">
          <div className="screen__content">
            <input type="hidden" name="next" value="/" />
            <form
              className="login"
              method="POST"
              onSubmit={handleSubmit}
              action="http://secureblast.pythonanywhere.com/accounts/reset_password/"
            >
              <div className="login__field">
                <input
                  type="text"
                  className="input-email"
                  name="email"
                  placeholder="  Email"
                  required
                />
              </div>
              <button className="button-reset" type="submit">
                Get Link
              </button>
              <a className="back-login" href="http://secureblast.pythonanywhere.com">
                Back to Log-In
              </a>
            </form>
          </div>
          <div className="screen__background">
            <span class="screen__background__shape shape4"></span>
            <span className="screen__background__shape shape3"></span>
            <span class="screen__background__shape shape2"></span>
            <span className="screen__background__shape shape1"></span>
          </div>
        </div>
      </div>
    </>
  );
}
// export Signup function to be import in index.js
export default Reset1;
