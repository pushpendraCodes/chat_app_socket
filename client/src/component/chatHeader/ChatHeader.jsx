import React from "react";
import "./chatHeader.css";
import { useNavigate } from "react-router-dom";
import { BiPointer, BiPowerOff } from "react-icons/bi";
import { logoutRoute } from "../../util/ApiRoutes";
import axios from "axios";
export default function ChatHeader({ currentChat }) {
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="Header">
      <div className="userDetails">
        <img
          style={{ width: "40px" }}
          src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
          alt=""
        />
        <p>{currentChat.username}</p>
      </div>
      <div className="logout">
        <BiPowerOff
          onClick={handleClick}
          cursor="pointer"
          size={25}
          color="blue"
        />
      </div>
    </div>
  );
}
