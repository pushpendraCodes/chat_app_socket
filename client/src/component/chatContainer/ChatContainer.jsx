import React, { useEffect, useRef, useState } from "react";
import ChatInput from "../chatInput/ChatInput";
import ChatHeader from "../chatHeader/ChatHeader";
import {
  sendMessageRoute,
  recieveMessageRoute,
  updatemsgStatus,
} from "../../util/ApiRoutes";
import axios from "axios";
import "./chatcontainer.css";
import { format } from "timeago.js";
import { v4 as uuidv4 } from "uuid";

export default function ChatContainer({
  currentChat,
  socket,
  setUnreadMessages,
  unreadMessages,
}) {
  const [messages, setmessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  // console.log(unreadMessages, "chatcontainer msg");

  function showNotification(message) {
    if (Notification.permission === "granted") {
      new Notification("New Message", {
        body: message,
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("New Message", {
            body: message,
          });
        }
      });
    }
  }

  async function handleSendMsg(msg) {
    try {
      let user = JSON.parse(localStorage.getItem("chat_app_user"));
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: user._id,
        msg,
        from_name: user.username,
      });

      let res = await axios.post(sendMessageRoute, {
        from: user._id,
        to: currentChat._id,
        message: msg,
      });
      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg });
      setmessages(msgs);
    } catch (error) {}
  }

  useEffect(() => {
    async function getMessages() {
      try {
        let user = JSON.parse(localStorage.getItem("chat_app_user"));
        let res = await axios.post(recieveMessageRoute, {
          from: user._id,
          to: currentChat._id,
        });

        setmessages(res.data);
      } catch (error) {}
    }
    getMessages();
  }, [currentChat]);

  // console.log(currentChat, "currentChat");

  function checkNewMsgCount(senderuserId) {
    // let a = unreadMessages.filter((item) => item.from === senderuserId);
    const index = unreadMessages.findIndex(
      (element) => element.from === senderuserId
    );
    console.log(index, "index");
    return index;
  }


  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", async (data) => {
        const { from } = data;

        console.log(data);
        console.log(currentChat, "setCurrentChat");

        if (data.from === currentChat._id) {
          setArrivalMessage({ fromSelf: false, message: data.msg });

          let res = await axios.post(updatemsgStatus, {
            from: data.from,
            to: data.to,
          });

          const index = checkNewMsgCount(from);
          if (index) {
            let updatedArry = unreadMessages.splice(index, 1);
            setUnreadMessages(updatedArry);
          }
        } else {
          // console.log(checkNewMsgCount(from), "checkNewMsgCount");
          // if (checkNewMsgCount(from) >= 0) {
          //   console.log("working");
          //   const index = checkNewMsgCount(from);
          //   const newarray = unreadMessages;
          //   newarray[index].msg.push(data.msg);
          //   newarray[index].count = newarray[index].count + 1;
          //   // console.log(newarray, "unreadMessages");
          //   setUnreadMessages(newarray);
          // } else {
          //   console.log("working1");
          //   const newarray = unreadMessages;
          //   const msgs = {};
          //   msgs.from = from;
          //   msgs.msg = [];
          //   msgs.msg.push(data.msg);
          //   msgs.count = 1;
          //   newarray.push(msgs);
          //   setUnreadMessages(newarray);
          // }
        }
      });
    }
  }, [socket.current]);

  useEffect(() => {
    arrivalMessage && setmessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="ChatContainer">
      <div className="header">
        <ChatHeader currentChat={currentChat} />
      </div>
      <div style={{ color: "white" }} className="messageContainer">
        {messages.map((message, i) => {
          return (
            <div key={i}>
              <div
                ref={scrollRef}
                key={uuidv4()}
                className={`messageBox ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <p className="content">{message.message}</p>
                <span className="timeago">{format(message.createdAt)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="chatInput">
        <ChatInput handleSendMsg={handleSendMsg} />
      </div>
    </div>
  );
}
