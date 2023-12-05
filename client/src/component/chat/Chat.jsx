import React, { useContext, useEffect, useRef, useState } from "react";
import "./chat.css";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { allUsersRoute } from "../../util/ApiRoutes";
import Welcome from "../welcome/Welcome";
import ChatContainer from "../chatContainer/ChatContainer";
import { host } from "../../util/ApiRoutes";
import { SocketContext } from "../../context/SocketContext";
import Contact from "../contacts/Contact";
export const Chat = () => {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  const [unreadMessages, setunreadMessages] = useState([]);
  // const { unreadMessages,updateArray } = useContext(SocketContext);
  // console.log(unreadMessages, "chat");

  const updateArray = newArray => {

    setunreadMessages([...newArray]);
    // setunreadMessages(newArray);


  }



  useEffect(() => {
    async function checkAuth() {
      if (!localStorage.getItem("chat_app_user")) {
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat_app_user")));
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    async function getContacts() {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        } else {
          navigate("/setAvatar");
        }
      }
    }
    getContacts();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };




  return (
    <div className="chat_container">
      <div className="chat_wrapper">
        <div className="left">
          <Contact
            contacts={contacts}
            changeChat={handleChatChange}
            socket={socket}

          />
        </div>
        <div className="right">
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              socket={socket}
              setUnreadMessages={updateArray}
              unreadMessages={unreadMessages}
            />
          )}
        </div>
      </div>
    </div>
  );
};
