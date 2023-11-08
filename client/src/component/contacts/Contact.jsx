import React, { useContext, useEffect, useState } from "react";
import "./contact.css";
import io, { Socket } from "socket.io-client";
import { SocketContext } from "../../context/SocketContext";
import { getunreadMessages, updatemsgStatus } from "../../util/ApiRoutes";
import axios from "axios";
export default function Contact({ contacts, changeChat, socket }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  const [unreadMessages, setunreadMessages] = useState();
  const [messageCounts, setMessageCounts] = useState({});

  console.log(messageCounts, "messageCounts");
  console.log(unreadMessages, "contact");

  useEffect(() => {
    async function getUser() {
      const data = await JSON.parse(localStorage.getItem("chat_app_user"));
      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatarImage);
    }
    getUser();
  }, []);

  async function getallUserunreadMsgs() {
    console.log("working");
    const data = await JSON.parse(localStorage.getItem("chat_app_user"));
    let res = await axios.post(getunreadMessages, { user: data._id });
    setunreadMessages(res.data);
    return res.data;
  }

  async function updateUnreadMsgs() {
    let totaUnreadMsgs = await getallUserunreadMsgs();
    const counts = totaUnreadMsgs?.reduce((acc, message) => {
      const id = message.users[0];
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});
    // Save the counts to the state
    setMessageCounts(counts);
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", async (data) => {
        updateUnreadMsgs();
      });
    }
  }, []);

  const changeCurrentChat = async (index, contact) => {
    // console.log(contact,"current chat")
    setCurrentSelected(index);
    changeChat(contact);
    try {
      const data = await JSON.parse(localStorage.getItem("chat_app_user"));
      let res = await axios.post(updatemsgStatus, {
        from: contact._id,
        to: data._id,
      });

      await getallUserunreadMsgs();
      await updateUnreadMsgs();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="contact_container">
      <div className="chat_logo">
        <img src="vite.gif" alt="" />
        <h2>Snapchat</h2>
      </div>
      <div className="chat_contacts">
        {contacts.map((contact, i) => {
          return (
            <div
              key={i}
              onClick={() => changeCurrentChat(i, contact)}
              className={`contact ${i === currentSelected ? "selected" : ""}`}
            >
              <div className="userImg">
                <img
                  style={{ width: "40px" }}
                  src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                  alt=""
                />
              </div>

              <div className="unreadmsgs">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h3 style={{ color: "white" }}>{contact.username}</h3>
                  {/* <span style={{ fontSize: "11px", color: "aquamarine" }}>
                    4day ago
                  </span> */}
                </div>
                <div className="newmsgs">
                  {Object.entries(messageCounts).map(([key, value]) => {
                    if (key === contact._id) {
                      return (
                        <>
                          <p className="latesMsg">...</p>{" "}
                          <span className="msgCount">{value}</span>
                        </>
                      );
                    }
                  })}

                  {/* {unreadMessages?.map((item) => {
                    console.log(item, "item");
                    if (item.sender === contact._id) {
                      return (
                        <>
                          <p className="latesMsg">
                            {item.msg[item.msg.length - 1]
                              .split("")
                              .splice(0, 30)}
                            ...
                          </p>{" "}
                          <span className="msgCount">{item.count}</span>
                        </>
                      );
                    }
                  })} */}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="currentUser">
        <img
          style={{ width: "40px" }}
          src={`data:image/svg+xml;base64,${currentUserImage}`}
          alt=""
        />
        <h2>{currentUserName}</h2>
      </div>
    </div>
  );
}
