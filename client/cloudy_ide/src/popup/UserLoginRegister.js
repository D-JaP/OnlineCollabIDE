import React, { useState } from "react";
import axios from 'axios'
import './UserLoginRegister.css'
import { redirect, useNavigate, useParams } from 'react-router-dom'


// define the token variable
const token = 'your-token-goes-here';

axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

export const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("")
  const [showForm, setShowForm] = useState(true)

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = {
      email: email,
      password: password,
    };

    try {
      //Handle response data
      const response = await axios.post("/api/v1/registration", user);
      setMessage(response.data.message)
      setShowForm(false)

      return response.data;
      //Handle error
    } catch (error) {
      console.log(error.response.data.message);
      setMessage(error.response.data.message)
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <h2>
        Register
      </h2>
      {showForm && (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button type="submit">Register</button>
        </div>

      )

      }
      <div>
        <p id="register-messages">{message}</p>
      </div>
    </form>
  );
};


//Continue from here...

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const {id} = useParams()
  
  const handleLogin = async (event) => {
    event.preventDefault();

    const credentials = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post("/api/v1/login", credentials);
      setToken(response.data.token);
      // save to cookie
      const cookie_name = "jwtToken"
      const cookie_value = response.data.token
      document.cookie = `${cookie_name}=${cookie_value}`

      // add prj to user database
      const data  = {
        id : id,
        email : email
      }

      const headers = {
        'Authorization': 'Bearer ' + cookie_value
      }
      const response2 = await axios.post("/api/v1/user/add", data, {
        headers:headers
      })

      setMessage("loggin sucessfully, closing after 3 seconds...")
      setTimeout(() => {
        navigate(0, {replace: true}) 
      }, 3000);
    } catch (error) {
      console.log(error.response.data.message);
      setMessage(error.response.data.message);
    }
  };


  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <p id="loggin-messages">{message}</p>
    </div>
  );
};

