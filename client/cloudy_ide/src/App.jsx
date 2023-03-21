import './App.css';
import React, { useRef } from 'react';
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
  



  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');

  
  function handleHtmlCodeChange(event) {
    if (!event) return
    setHtmlCode(event.target.value);
  }

  function handleCssCodeChange(event) {
    if (!event) return
    setCssCode(event.target.value);
  }

  function handleJsCodeChange(event) {
    if (!event) return
    setJsCode(event.target.value);
  }


  return (
    <Router>
      <Routes>
        <Route 
          path='/'
          element={<Navigate replace to={`/project/${uuidV4()}`} />} />
        <Route path='/project/:id' element={
          <div>
            <div className="container">
              <div className="left">
                <label><i className="fa-brands fa-html5"></i>HTML</label>
                <textarea id="html-code" onKeyUp={handleHtmlCodeChange} ></textarea>

                <label><i className="fa-brands fa-css3-alt"></i>CSS</label>
                <textarea id="css-code" onKeyUp={handleCssCodeChange}></textarea>

                <label><i className="fa-brands fa-js"></i>JavaScript</label>
                <textarea id="js-code" onKeyUp={handleJsCodeChange}></textarea>
              </div>
              <div className="right">
                <label><i className="fa-solid fa-play"></i>Output</label>
                <iframe id="output" srcDoc={htmlCode + "<style>" + cssCode + "</style>" + "<script>" + jsCode + "</script>"}></iframe>
              </div>
            </div>

            <CodeEditor lang="javascript" theme="light" onChange={(e) => setCode(e.target.value)} value={code} />
          </div>


        } />
      </Routes>
    </Router>
  );

}

export default App;
