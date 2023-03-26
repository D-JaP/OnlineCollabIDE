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
  Navigate,
  useParams
} from 'react-router-dom'
import {v4 as uuidV4} from 'uuid'
import CodeEditor from './CodeEditor';
import Editor from './Editor';


function App() {
  const [socket, setSocket] = useState()

  
  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s)
    return () => {
      s.disconnect();
    }
  }, [])
  
  
  const [html, setHtml] = useState();
  const [css, setCss] = useState();
  const [js, setJs] = useState();

  
  const handleHtmlChange = (value) => {
    setHtml(value);
  };
  
  const handleCssChange = (value) => {
    setCss(value);
  };

  const handleJsChange = (value) => {
    setJs(value);
  };

  // save code
  // useEffect(() => {
  //   if (socket == null) return
  //   const save_data = { _id: documentId, data: { html: html, css: css, js: js } }
  //   const interval = setInterval(() => {
  //     socket.emit('save-code', save_data)
  //   }, SAVE_INTERVAL_MS)

  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [html, css, js, socket])



  

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
                <Editor id="html-editor" lan="html" socket={socket} onChange = {handleHtmlChange} value={html}></Editor>
                <label><i className="fa-brands fa-css3-alt"></i>CSS</label>
                <Editor id="css-editor" lan="css" socket={socket} onChange = {handleCssChange} value={css}></Editor>
                <label><i className="fa-brands fa-js"></i>JavaScript</label>
                <Editor id="js-editor" lan="js" socket={socket} onChange = {handleJsChange} value={js}></Editor>
              </div>
              <div className="right">
                <label><i className="fa-solid fa-play"></i>Output</label>
                <iframe id="output" srcDoc={html+ "<style>" + css + "</style>" + "<script>" + js + "</script>" }></iframe>
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
