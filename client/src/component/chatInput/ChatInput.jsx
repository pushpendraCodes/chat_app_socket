import React, { useState } from "react";
import { BiSend } from "react-icons/bi";
import { BsEmojiSmileFill } from "react-icons/bs";
import Picker from "emoji-picker-react";

import "./chatinput.css";
export default function ChatInput({handleSendMsg }) {

    const [msg, setMsg] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const handleEmojiPickerhideShow = () => {
      setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiClick = (event) => {
      let message = msg;
      console.log(event.emoji)
      message += event.emoji;
      setMsg(message);
    };

    const sendChat = (event) => {
      event.preventDefault();
      if (msg.length > 0) {
        handleSendMsg(msg);
        setMsg("");
      }
    };

  return (

      <div className="inputBox">
        <div className="imogy">
        <BsEmojiSmileFill color="yellow" onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
          className="input"
        />
       {
        msg &&  <button type="submit" onClick={sendChat} className="sendbtn">
          <BiSend  color="blue" cursor="pointer" size={25} />
        </button>
       }
      </div>

  );
}
