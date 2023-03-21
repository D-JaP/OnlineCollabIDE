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
  
  
  const [htmlCode, setHtmlCode] = useState('<div>hello world<div>');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');

  useEffect(() => {
    if (socket == null | htmlCode == null) return 
    const handler = (value) => {
      setHtmlCode(value);
    }
    socket.on("receive-changes-html", handler);

    return () => {
      socket.off("receive-changes-html", handler);
    }
  }, [socket,htmlCode])

  useEffect(() => {
    if (socket == null | cssCode == null) return 
    const handler = (value) => {
      setCssCode(value);
    }
    socket.on("receive-changes-css", handler);

    return () => {
      socket.off("receive-changes-css", handler);
    }
  }, [socket,cssCode])

  useEffect(() => {
    if (socket == null | jsCode == null) return 
    const handler = (value) => {
      setJsCode(value);
    }
    socket.on("receive-changes-js", handler);

    return () => {
      socket.off("receive-changes-js", handler);
    }
  }, [socket,jsCode])

  // useEffect(() => {
  //   if (socket== null | htmlCode == null) return 
  //   socket.emit("send-changes-html",htmlCode)
  //   console.log("send-data")
  //   return () => {
  //   }
  // }, [htmlCode,socket])

  const onChangeHtml = React.useCallback((event) => {
    setHtmlCode(event.target.value);
    socket.emit("send-changes-html", event.target.value);
  }, [socket]); 

  const onChangeCss = React.useCallback((event) => {
    setCssCode(event.target.value);
    socket.emit("send-changes-css", event.target.value);
  }, [socket]); 

  const onChangeJs = React.useCallback((event) => {
    setJsCode(event.target.value);
    socket.emit("send-changes-js", event.target.value);
  }, [socket]); 
  

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
                <textarea id="html-code" onChange={onChangeHtml} value={htmlCode}></textarea>

                <label><i className="fa-brands fa-css3-alt"></i>CSS</label>
                <textarea id="css-code" onChange={onChangeCss} value={cssCode}></textarea>

                <label><i className="fa-brands fa-js"></i>JavaScript</label>
                <textarea id="js-code" onChange={onChangeJs} value={jsCode}></textarea>
              </div>
              <div className="right">
                <label><i className="fa-solid fa-play"></i>Output</label>
                <iframe id="output" srcDoc={htmlCode + "<style>" + cssCode + "</style>" + "<script>" + jsCode + "</script>"}></iframe>
              </div>
            </div>

            {/* <CodeEditor lang="javascript" theme="light" onChange={(e) => setCode(e.target.value)} value={code} /> */}
          </div>


        } />
      </Routes>
    </Router>
  );

}

export default App;
