import './App.css';
import React from 'react';
import { javascript } from '@codemirror/lang-javascript';
import { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import { Socket } from 'engine.io-client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import {v4 as uuidV4} from 'uuid'
import CodeEditor from './CodeEditor';


function App() {
  const [socket, setSocket] = useState()

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s)
    return () => {
      s.disconnect();
    }
  }, [])
  

  const [code, setCode] = useState("Console.log(\"Hello World\")");

  const onChange = React.useCallback((value, viewUpdate) => {
    setCode(value);
    socket.emit("send-changes", value);
    }, [socket]); 
  


  useEffect(() => {
    if (socket== null) return 

    socket.on("receive-changes", (value)=>{
      setCode(value)  
    });

    return () => {
      
    }
  }, [socket])
  

  return (
    <Router>
      <Routes>
        <Route 
          path='/'
          element={<Navigate replace to={`/project/${uuidV4()}`} />}/>
        <Route path='/project/:id' element={
            <CodeEditor lang="javascript" theme="light" onChange={(e) =>setCode(e.target.value)} value={code}/>
        }/>
      </Routes>
    </Router>
  );

}

export default App;
