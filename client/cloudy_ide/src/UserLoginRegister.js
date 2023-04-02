import React, { useState} from "react";
import axios from 'axios'
import './UserLoginRegister.css'

// define the token variable
const token = 'your-token-goes-here';

axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const user = {
            email: email,
        password: password,
        };

        try{
        //Handle response data
            const response = await axios.post("http://localhost:4000/register", user);
            return response.data;
        //Handle error
        }catch (error) {
            console.log(error);
    }
  };


    return (
    <form onSubmit={handleSubmit}>
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
    </form>
    );
};

//Continue from here...

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("");
  
    const handleLogin = async (event) => {
      event.preventDefault();
  
      const credentials = {
        email: email,
        password: password,
      };
  
      try {
        const response = await axios.post("http://localhost:4000/login", credentials);
        setToken(response.data.token);
      } catch (error) {
        console.log(error);
      }
    };
  
    const handleFetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.log(error);
      }
    };
  
    return (
      <div>
        <h2>Hello</h2>
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
        <button onClick={handleFetchUserData}>Fetch User Data</button>
      </div>
    );
  };

