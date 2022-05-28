import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import "./signup.css";
import "./signup.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // import react icons
import {faUser, faEnvelope, faLock} from "@fortawesome/free-solid-svg-icons";

// this function returns csrf token for current session
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

function Signup() {
  // handle state of the value of each infut field in signup form according to backend response
  const [inputFname, setInputFname] = useState("");
  const [inputLname, setInputLname] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPw1, setinputPw1] = useState("");
  const [inputPw2, setinputPw2] = useState("");

  // submit login form manually
  const handleSubmit = (e) => {
    e.preventDefault();
    setInputFname("");
    setInputLname("");
    setInputEmail("");
    setinputPw1("");
    setinputPw2("");

    // recieve form data and sending to the backend with XMLHttpRequest
    // handling response

    const userForm = document.getElementById("dark-light-div");
    const form = e.target;
    const formData = new FormData(form);
    const url = form.getAttribute("action");
    const method = form.getAttribute("method");
    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    const csrftoken = getCookie("csrftoken");
    xhr.open(method, url);
    xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);

    // catch backend response
    xhr.onload = function () {
      const createdUser = xhr.response;
      const status = xhr.status;

      // do validation according to the response from backend
      // status 201 = user successfully authenticated
      if (status === 201) {
        alert("User Successfully Registered!");
        form.reset();
        window.location.replace("http://127.0.0.1:8000/accounts/login");
        // status 400 = the login form user submitted is invalid
      } else if (status === 400) {
        for (const error in createdUser) {
          if (error) {
            var inputList = document.getElementsByTagName("input");
            for (var i = 1; i < inputList.length; i++) {
              let inputName = inputList[i].name;
              if (inputName === error) {
                inputList[i].value = "";
              }
            }
          }
        }
        // set state of the error to each input field placeholder
        console.log(createdUser);
        setInputFname(createdUser.first_name);
        setInputLname(createdUser.last_name);
        setInputEmail(createdUser.email);
        setinputPw1(createdUser.password1);
        setinputPw2(createdUser.password2);
      }
    };
    // handling other internal server errors
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
        <div className="screen">
          <div className="screen__content">
            <form
              className="signup"
              method="POST"
              onSubmit={handleSubmit}
              action="http://127.0.0.1:8000/accounts/create"
            >
              <input type="hidden" name="next" value="/" />
              <div className="signup-div">
                <FontAwesomeIcon className="icon" icon={faUser} />
                <input
                  type="text"
                  className="signup-input"
                  placeholder={inputFname ? inputFname : "  Enter First Name"}
                  name="first_name"
                ></input>
              </div>
              <div className="signup-div">
              <FontAwesomeIcon className="icon" icon={faUser} />
                <input
                  type="text"
                  className="signup-input"
                  placeholder={inputLname ? inputLname : "  Enter Last Name"}
                  name="last_name"
                ></input>
              </div>
              <div className="signup-div">
              <FontAwesomeIcon className="icon" icon={faEnvelope} />
                <input
                  type="text"
                  className="signup-input"
                  placeholder={inputEmail ? inputEmail : "  Enter Email"}
                  name="email"
                ></input>
              </div>
              <div className="signup-div">
              <FontAwesomeIcon className="icon" icon={faLock} />
                <input
                  type="password"
                  className="signup-input"
                  placeholder={inputPw1 ? inputPw1 : "  Enter Password"}
                  name="password1"
                ></input>
              </div>
              <div className="signup-div">
              <FontAwesomeIcon className="icon" icon={faLock} />
                <input
                  type="password"
                  className="signup-input"
                  placeholder={inputPw2 ? inputPw2 : "  Confirm Password"}
                  name="password2"
                ></input>
              </div>
              <button className="button signup-submit"> Sign-up </button>
            </form>
            <div className="back-to-login">
              Already have an account?{" "}
              <a href="http://127.0.0.1:8000/accounts/login">Log-In</a>
            </div>
          </div>
          <div className="screen__background">
            <span class="screen__background__shape shape4"></span>
            {/* <span className="screen__background__shape shape3"></span> */}
            <span class="screen__background__shape shape2"></span>
            <span className="screen__background__shape shape1"></span>
          </div>
        </div>
      </div>
    </>
  );
}

// export Signup function to be import in index.js
export default Signup;
