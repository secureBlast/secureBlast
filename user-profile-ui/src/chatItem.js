import React from "react";

export function ChatItem({ position, color }) {
  const rootStyle = {
    width: 300,
    height: 50,
    marginTop: 10,
    marginBottom: 10
  };

  const messageStyle = {
    width: 200,
    marginTop: 20,
    height: 50,
    float: position,
    background: color
  };

  return (
    <div style={rootStyle}>
      <div style={messageStyle}>Some message !</div>
    </div>
  );
}
