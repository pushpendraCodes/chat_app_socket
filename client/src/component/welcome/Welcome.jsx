import React, { useEffect, useState } from "react";
import gify from "../../assets/giphy.gif"
import "./welcome.css"
export default function Welcome() {
  const [userName, setUserName] = useState("");

  useEffect( () => {
    async function getUser(){
    setUserName(
        await JSON.parse(
          localStorage.getItem("chat_app_user")
        ).username
      );
  }
  getUser()
  }, []);

  return (
    <div className="welcome_container">
      <img  src={gify} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </div>
  );
}
