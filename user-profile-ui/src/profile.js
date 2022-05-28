import React, { useEffect, useState, useRef } from "react";
import "./profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // import react icons
import {
  faKey,
  faLock,
  faPaperPlane,
  faSignOut,
  faUsersLine,
} from "@fortawesome/free-solid-svg-icons";
import logo from "./Images/logo2.png";

// this function return csrf token for the current session
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

// setting up room view
// This method updating the exsisting rooms on view rooms
const RoomTemplate = (props) => {
  const { roomName, code } = props;
  return (
    <>
      <div className="notification">
        <div className="flexContainerRow">
          <div className="notification-detailsDiv">
            <span>
              {roomName} - {code}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

// user message teplate
const MessageSendTemplate = (props) => {
  const { message, time, user } = props;
  return (
    <div class="chat-container">
      <div className="sending-text">
        <div className="user">{user}</div>
        <div> {message}</div>
        <div className="time">{time}</div>
      </div>
    </div>
  );
};

const MessageReceiveTemplate = (props) => {
  const { message, time, user } = props;
  return (
    <div class="chat-container">
      <div className="receiving-text">
        <div className="user">{user}</div>
        <div> {message}</div>
        <div className="time">{time}</div>
      </div>
    </div>
  );
};

const MessageRTemplate = (props) => {
  const { message, time, is_current_user, user } = props;

  // eslint-disable-next-line no-lone-blocks
  {
    if (is_current_user === 1) {
      return <MessageSendTemplate message={message} time={time} user={user} />;
    }
    return <MessageReceiveTemplate message={message} time={time} user={user} />;
  }
};

// ---------------------------------
// this function format substring
function substringBetween(s, a, b) {
  var p = s.indexOf(a) + a.length;
  return s.substring(p, s.indexOf(b, p));
}

var room_names = [];
var room_codes = [];

var room_messages = [];
var msg_users = [];
var active_room_code = 0;
var is_room_active = false;

var messages = [];
var users = [];
var times = [];
var is_session_user = [];
var senders_recievers = [];

function Profile() {
  const myDiv = useRef(null);
  const [profileId, setProfileId] = useState("");
  const [profileFname, setProfileFname] = useState("");
  const [profileLname, setProfileLname] = useState("");
  const [profileEmail, setprofileEmail] = useState("");
  const [imgPath, setImgPath] = useState("");
  const [inputRoomName, setInputRoomName] = useState("");
  const [inputRoomCode, setInputRoomCode] = useState("");
  const [inputJoinRoomName, setInputJoinRoomName] = useState("");
  const [inputJoinRoomCode, setInputJoinRoomCode] = useState("");
  const [messagesR, setMessagesR] = useState([]);
  const [readyForRender, setReadyForRender] = React.useState(false);

  const [activeRoomName, setActiveRoomName] = useState("");
  const [activeRoomCode, setActiveRoomCode] = useState("");

  // handling form request to join room
  const handleJoinRoom = (e) => {
    e.preventDefault();
    setInputJoinRoomName("");
    setInputJoinRoomCode("");

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
      const response = xhr.response;
      const status = xhr.status;

      // do validation according to the response from backend
      // status 201 = user successfully authenticated
      if (status === 200) {
        if (response.msg_list.length > 0) {
          var msgList = response.msg_list;
          for (let i = 0; i < msgList.length; i++) {
            room_messages.push(msgList[i].message);
            msg_users.push(msgList[i].email);
          }
          active_room_code = msgList[0].room.code;
          is_room_active = msgList[0].room.active;
        }
        alert("Successfully Joined!");
        form.reset();
        window.location.reload();
        // status 400 = the login form user submitted is invalid
      } else if (status === 400) {
        for (const error in response) {
          if (error) {
            if (response.__all__ != undefined) {
              alert(response.__all__);
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
        setInputJoinRoomName(response.room_name);
        setInputJoinRoomCode(response.code);
      }
    };
    // handling other internal server errors
    xhr.onerror = function () {
      alert("An Error Occurede!");
    };
    xhr.send(formData);
  };

  // handling form request to join room
  const sendMessage = (e) => {
    e.preventDefault();
    setInputJoinRoomName("");
    setInputJoinRoomCode("");

    // recieve form data and sending to the backend with XMLHttpRequest
    // handling response
    const form = e.target;
    const formData = new FormData(form);
    const url = "http://127.0.0.1:8000/room/create-message/" + activeRoomCode // req url
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
      form.reset();
      window.location.reload();
    };
    // handling other internal server errors
    xhr.onerror = function () {
      alert("An Error Occurede!");
    };
    xhr.send(formData);
  };

  // handling form request to create room
  const handleCreateRoom = (e) => {
    e.preventDefault();
    setInputRoomName("");
    setInputRoomCode("");

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
        alert("Room Successfully Created!");
        form.reset();
        window.location.reload();
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
        console.log(createdUser);
        setInputRoomName(createdUser.room_name);
        setInputRoomCode(createdUser.code);
      }
    };
    // handling other internal server errors
    xhr.onerror = function () {
      alert("An Error Occurede!");
    };
    xhr.send(formData);
  };

  // this function request and fetching the user profile image
  useEffect(() => {
    const url = "http://127.0.0.1:8000/profiles/users/data/img";
    const method = "GET";
    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    const csrftoken = getCookie("csrftoken");
    xhr.open(method, url);
    xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);

    xhr.onload = function () {
      const img = xhr.response;
      if (img.img_path == '""') {
        setImgPath("http://127.0.0.1:8000/images/profile_default.jpg");
      } else {
        setImgPath(
          "http://127.0.0.1:8000/images/" +
            substringBetween(img.img_path, '"', '"')
        );
      }
    };
    xhr.send();
  }, []);

  // this function request and fetching user data from backend
  useEffect(() => {
    const url = "http://127.0.0.1:8000/profiles/users/data/details";
    const method = "GET";
    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    const csrftoken = getCookie("csrftoken");
    xhr.open(method, url);
    xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);

    xhr.onload = function () {
      const profile = xhr.response;
      setProfileId(profile.user.id);
      setProfileFname(profile.user.first_name);
      setProfileLname(profile.user.last_name);
      setprofileEmail(profile.user.email);
    };
    xhr.send();
  }, []);

  const logout = () => {
    window.location.replace("http://127.0.0.1:8000/accounts/logout");
  };

  const [roomNames, setRoomNames] = useState([]);
  const [roomCodes, serRoomCodes] = useState([]);
  // this function request and fetching the user's chat room list
  useEffect(() => {
    const url = "http://127.0.0.1:8000/room/rooms";
    const method = "GET";
    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    const csrftoken = getCookie("csrftoken");
    xhr.open(method, url);
    xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);

    xhr.onload = function () {
      const response = xhr.response;
      var roomList = response.room_list;
      for (let i = 0; i < roomList.length; i++) {
        room_names.push(roomList[i].room_name);
        room_codes.push(roomList[i].code);
      }

      if (xhr.status == 200) {
        setRoomNames(roomNames.push(room_names));
        serRoomCodes(roomCodes.push(room_codes));
      }
    };
    xhr.send();
  }, []);

  // this function request and fetching the user's chat room list
  useEffect(() => {
    const url = "http://127.0.0.1:8000/room/messages";
    const method = "GET";
    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    const csrftoken = getCookie("csrftoken");
    xhr.open(method, url);
    xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);

    xhr.onload = function () {
      const response = xhr.response;
      setActiveRoomName(response.room_name);
      setActiveRoomCode(response.room_code);
      if (response.messages_list.length > 0) {
        var msgList = response.messages_list;
        for (let i = 0; i < msgList.length; i++) {
          if (msgList[i].email === response.current_user) {
            is_session_user.push(1);
          } else {
            is_session_user.push(0);
          }
          messages.push(msgList[i].message);
          users.push(msgList[i].email);
          let time = substringBetween(msgList[i].date, "T", "Z");
          time = time.substring(0, 5);
          times.push(time);
          senders_recievers.push(msgList[i].first_name);
          setMessagesR([...messagesR, { val: "A new Book", id: i }]);
        }
        active_room_code = msgList[0].room.code;
        is_room_active = msgList[0].room.active;
      }

      if (xhr.status == 200) {
        // setRoomNames(roomNames.push(room_names));
        // serRoomCodes(roomCodes.push(room_codes));
      }
    };
    xhr.send();
    setReadyForRender(true);
  }, []);


  // -----------------------------------------

  const editForm = (e) => {
    e.preventDefault();

    window.location.replace(
      "http://127.0.0.1:8000/profiles/users/update/edit"
    );
  };

  return (
    <>
      <div className="maincontainer">
        <div className="container">
          <div className="profile-page tx-13">
            <div className="row">
              <div className="col-12 grid-margin">
                <div className="profile-header ">
                  <div className="cover screen__background">
                    <span class="screen__background__shape shape4"></span>
                    <span className="screen__background__shape shape3"></span>
                    <span class="screen__background__shape shape2"></span>
                    <span className="screen__background__shape shape1"></span>
                    <div className="gray-shade"></div>

                    <div className="cover-body d-flex justify-content-between align-items-center profile-head">
                      <div>
                        <img
                          className="profile-pic"
                          src={imgPath}
                          alt="profile"
                        />
                        <span className="profile-name">
                          {profileFname.toUpperCase()}{" "}
                          {profileLname.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="header-links">
                    <ul className="links d-flex align-items-center mt-3 mt-md-0">
                      <li className="header-link-item d-flex align-items-center active nav-bar">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="feather feather-columns mr-1 icon-md"
                        >
                          <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"></path>
                        </svg>
                        <a className="pt-1px d-none d-md-block" href="#">
                          Timeline
                        </a>
                      </li>
                      <li className="header-link-item ml-3 pl-3 border-left d-flex align-items-center nav-bar">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="feather feather-user mr-1 icon-md"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <a className="pt-1px d-none d-md-block" href="#">
                          About
                        </a>
                      </li>
                      <li className="header-link-item ml-3 pl-3 border-left d-flex align-items-center nav-bar">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="feather feather-users mr-1 icon-md"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <a className="pt-1px d-none d-md-block" href="#">
                          Friends
                        </a>
                      </li>
                      <li className="header-link-item ml-3 pl-3 border-left d-flex align-items-center nav-bar">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="feather feather-image mr-1 icon-md"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          ></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        <a className="pt-1px d-none d-md-block" href="#">
                          Photos
                        </a>
                      </li>
                      <li className="header-link-item ml-3 pl-3 border-left d-flex align-items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="feather feather-video mr-1 icon-md"
                        >
                          <polygon points="23 7 16 12 23 17 23 7"></polygon>
                          <rect
                            x="1"
                            y="5"
                            width="15"
                            height="14"
                            rx="2"
                            ry="2"
                          ></rect>
                        </svg>
                        <a className="pt-1px d-none d-md-block" href="#">
                          Videos
                        </a>
                      </li>
                    </ul>
                    <div className="d-none d-md-block">
                      <button
                        className="btn btn-primary btn-icon-text btn-edit-profile"
                        onClick = {editForm}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="feather feather-edit btn-icon-prepend"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>{" "}
                        Edit profile
                      </button >
                      <div id="popup2" class="overlay-edit-profile">
                        <div class="popup">
                          <a class="close" href="#">
                            &times;
                          </a>
                        </div>
                      </div>
                      &nbsp;
                      <button
                        className="btn btn-danger btn-icon-text btn-log-out"
                        onClick={logout}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="feather feather-edit btn-icon-prepend"
                        >
                          <FontAwesomeIcon className="icon" icon={faSignOut} />
                        </svg>{" "}
                        Log Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row profile-body">
              <div className="d-none d-md-block col-md-4 col-xl-3 left-wrapper">
                <div className="card rounded">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <h6 className="card-title mb-0">About</h6>
                      <div className="dropdown">
                        <button
                          className="btn p-0"
                          type="button"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="feather feather-more-horizontal icon-lg text-muted pb-3px"
                          >
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="19" cy="12" r="1"></circle>
                            <circle cx="5" cy="12" r="1"></circle>
                          </svg>
                        </button>
                        <div
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                        ></div>
                      </div>
                    </div>
                    <p>Hi! I'm {profileFname}</p>
                    <div className="mt-3">
                      <label className="tx-11 font-weight-bold mb-0 text-uppercase">
                        First Name:
                      </label>
                      <p className="text-muted">{profileFname}</p>
                    </div>
                    <div className="mt-3">
                      <label className="tx-11 font-weight-bold mb-0 text-uppercase">
                        Last Name:
                      </label>
                      <p className="text-muted">{profileLname}</p>
                    </div>
                    <div className="mt-3">
                      <label className="tx-11 font-weight-bold mb-0 text-uppercase">
                        Email:
                      </label>
                      <p className="text-muted">{profileEmail}</p>
                    </div>
                    <div className="mt-3">
                      <label className="tx-11 font-weight-bold mb-0 text-uppercase">
                        Website:
                      </label>
                      <p className="text-muted">
                        {" "}
                        <a className="pt-1px d-none d-md-block" href="#">
                          http://127.0.0.1:8000/
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-8 col-xl-6 middle-wrapper">
                <div className="row">
                  <div className="col-md-12 grid-margin">
                    <div className="card rounded aa">
                      <div className="card-header">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center ">
                            <img
                              className="img-xs rounded-circle"
                              src="https://therichpost.com/wp-content/uploads/2021/03/avatar6.png"
                              alt=""
                            />
                            <div className="ml-2 room-details">
                              <p className="room-detail">
                                {activeRoomName} - {activeRoomCode}
                              </p>
                            </div>
                          </div>
                          <div className="dropdown bb">
                            {/* --------------------pop up window--------------------- */}

                            <div class="box">
                              <a class="btn-view-rooms" href="#popup1">
                                View Rooms
                              </a>
                            </div>

                            <div id="popup1" class="overlay">
                              <div class="popup">
                                <a class="close" href="#">
                                  &times;
                                </a>
                                <div class="cont">
                                  {room_names.map((item, index) => (
                                    <RoomTemplate
                                      roomName={item}
                                      code={room_codes[index]}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* -------------------------------------------------------- */}
                          </div>
                        </div>
                      </div>
                      <div
                        className="card-body message-body chat-body-div"
                        ref={myDiv}
                      >
                        {messages.map((item, index) => (
                          <MessageRTemplate
                            key={index}
                            message={item}
                            time={times[index]}
                            is_current_user={is_session_user[index]}
                            user={senders_recievers[index]}
                          />
                        ))}
                      </div>
                      <div className="card-footer">
                        <form
                        method="POST"
                        onSubmit={sendMessage}
                        >
                          <input type="text" className="message-input" name="value"></input>
                          <button type="submit" className="btn-send-message">
                            <FontAwesomeIcon
                              className="icon"
                              icon={faPaperPlane}
                            />
                          </button >
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="d-none d-xl-block col-xl-3 right-wrapper">
                <div class="row">
                  <div class="col-md-12 grid-margin">
                    <div class="card rounded create-room-div">
                      <div class="card-body">
                        <h6 class="card-title">Create Room</h6>
                        <form
                          method="POST"
                          onSubmit={handleCreateRoom}
                          action="http://127.0.0.1:8000/room/create-room"
                        >
                          <div>
                            <FontAwesomeIcon
                              className="icon"
                              icon={faUsersLine}
                            />
                            <input
                              type="text"
                              className="input-field"
                              name="room_name"
                              placeholder={
                                inputRoomName ? inputRoomName : "  Room Name"
                              }
                            />
                          </div>
                          <div>
                            <FontAwesomeIcon className="icon" icon={faLock} />
                            <input
                              type="text"
                              className="input-field room-code"
                              name="code"
                              placeholder={
                                inputRoomCode ? inputRoomCode : "  Room Code"
                              }
                            />
                          </div>

                          <button className="btn-create-room" type="submit">
                            Create Room
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                  {/* ---------------------------------------------------------------- */}
                  <div class="col-md-12 grid-margin">
                    <div class="card rounded join-room-div1">
                      <div class="card-body join-room-div2">
                        <h6 class="card-title">Join Room</h6>
                        <form
                          method="POST"
                          onSubmit={handleJoinRoom}
                          action="http://127.0.0.1:8000/room/join-room"
                        >
                          <div>
                            <FontAwesomeIcon
                              className="icon"
                              icon={faUsersLine}
                            />
                            <input
                              type="text"
                              className="input-field"
                              name="room_name"
                              placeholder={
                                inputJoinRoomName
                                  ? inputJoinRoomName
                                  : "  Room Name"
                              }
                            />
                          </div>
                          <div>
                            <FontAwesomeIcon className="icon" icon={faLock} />
                            <input
                              type="text"
                              className="input-field room-code"
                              name="code"
                              placeholder={
                                inputJoinRoomCode
                                  ? inputJoinRoomCode
                                  : "  Room Code"
                              }
                            />
                          </div>
                          <button className="btn-join-room" type="submit">
                            Join Room
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Profile;
