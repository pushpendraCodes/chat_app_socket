import React, { useState, useEffect } from "react";
import axios from "axios";

import { useNavigate, Link } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../../util/ApiRoutes";
import "./auth.css";

export default function Login() {
 const navigate = useNavigate()
  const [values, setValues] = useState({ username: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    if (localStorage.getItem("chat_app_user")) {
      navigate("/setAvatar");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
         "chat_app_user",
          JSON.stringify(data.user)
        );

        navigate("/");
      }
    }
  };

  return (
    <>
      <div className="container">
        <div className="wrapper">
          <div className="heading">
            <h2>snapchat</h2>
            <img src="vite.gif" alt="" />
          </div>
          <div className="form">
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={(e) => handleChange(e)}
              min="3"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="btn-container">
            <button type="submit" onClick={handleSubmit} className="btn">
              Submit
            </button>
            <span>
            Don't have an account ? <Link to="/register">Create One.</Link>
          </span>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
