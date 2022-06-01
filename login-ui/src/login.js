import React, { useState, useEffect, useRef } from "react";
import "./login.css";
import "./login1.scss";
import lap from "./Images/lap.png";
import lapbg1 from "./Images/bg.jpg";
import lapbg2 from "./Images/bg2.jpg";
import lapbg3 from "./Images/bg3.jpg";
import lapbg4 from "./Images/logo.jpg";
import logo from "./Images/logoBlack.png";

// this method returns the csrf token for this session
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

//function to return main view of signup page
function Login() {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPw1, setinputPw1] = useState("");

  // submit login form manually
  const handleSubmit = (e) => {
    e.preventDefault();
    setInputEmail("");
    setinputPw1("");

    // recieve form data and sending to the backend with XMLHttpRequest
    // handling response
    const form = e.target;
    const formData = new FormData(form);
    const url = form.getAttribute("action"); // req url
    const method = form.getAttribute("method"); // req method
    const xhr = new XMLHttpRequest();
    xhr.responseType = "json"; // data recieving format
    const csrftoken = getCookie("csrftoken"); // get csrf token for this session
    xhr.open(method, url);
    xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest"); // set security headers
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);

    // catch backend response
    xhr.onload = function () {
      const createdUser = xhr.response;
      const status = xhr.status;

      // do validation according to the response from backend
      // status 201 = user successfully authenticated
      if (status === 201) {
        alert("User Successfully Login!");
        form.reset();
        window.location.replace(
          "http://secureblast.pythonanywhere.com/profiles/users/" + createdUser.first_name
        );
        // status 400 = the login form user submitted is invalid
      } else if (status === 400) {
        for (const error in createdUser) {
          if (error) {
            if (createdUser.__all__ != undefined) {
              alert(createdUser.__all__);
              break;
            } else {
              var inputList = document.getElementsByTagName("input");
              for (var i = 1; i < inputList.length; i++) {
                let inputName = inputList[i].name;
                if (inputName === error) {
                  inputList[i].value = "";
                }
              }
            }
          }
        }
        // set state of the error to each input field placeholder
        setInputEmail(createdUser.username);
        setinputPw1(createdUser.password);
      }
    };
    // handling other internal server errors
    xhr.onerror = function () {
      alert("An Error Occurede!");
    };
    xhr.send(formData);
  };

  // let slide_content = document.querySelector('#slide-content');
  let slide_index = 0;
  const myContainer = useRef(null);

  const slide = () => {
    let slide_content = myContainer.current;
    let slide_items = slide_content.querySelectorAll("img");
    slide_items.forEach((e) => e.classList.remove("active"));
    slide_index = slide_index + 1 === slide_items.length ? 0 : slide_index + 1;
    slide_items[slide_index].classList.add("active");
  };

  useEffect(() => {
    setInterval(slide, 4000);
  });

  return (
    <>
      <img className="logo" src={logo} alt="profile" />
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
      <div className="slide-container">
        <img className="home-pic" src={lap} alt="profile" />
        <div className="slide-content" id="slide-content" ref={myContainer}>
          <img className="img-content" src={lapbg4} alt="profile" />
          <img className="img-content active" src={lapbg1} alt="profile" />
          <img className="img-content" src={lapbg2} alt="profile" />
          <img className="img-content" src={lapbg3} alt="profile" />
        </div>
      </div>
      <div className="container">
        <div className="screen">
          <div className="screen__content">
            <input type="hidden" name="next" value="/" />
            <form
              className="login"
              method="POST"
              onSubmit={handleSubmit}
              action="http://secureblast.pythonanywhere.com/accounts/auth"
            >
              <div className="login__field">
                <input
                  type="text"
                  className="login__input"
                  name="username"
                  placeholder={inputEmail ? inputEmail : "  Email"}
                />
              </div>
              <div className="login__field">
                <input
                  type="password"
                  className="login__input"
                  name="password"
                  placeholder={inputPw1 ? inputPw1 : "  Password"}
                />
              </div>
              <button className="button login__submit" type="submit">
                Log-In
              </button>
            </form>
            <div className="forgot-pw">
              <a href="http://secureblast.pythonanywhere.com/accounts/reset">Forgot password</a>
            </div>
            <div className="sign-up">
              Don't have an account?{" "}
              <a href="http://secureblast.pythonanywhere.com/accounts/register">Sign-Up</a>
            </div>
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
export default Login;
