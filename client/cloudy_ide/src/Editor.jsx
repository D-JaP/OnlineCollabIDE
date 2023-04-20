import React from 'react'
import { useEffect, useState, useReducer } from 'react';
import { useParams } from 'react-router-dom';

function Editor(props) {
  const { id: documentId } = useParams();
  const [codedata, setCodeData] = useState({_id:null,client_id: null, code: ''});
  const SAVE_INTERVAL_MS =500;
  const [loaded, setLoaded] = useState(false)
  const initQueue =[{_id: null, client_id:null, code: null},{_id: null, client_id:null, code: null}]
  const [hasChange, setHasChange] = useState(false)
  const reducerQueue = (state,action) => {
    switch (action.type){
      case 'enqueue':
        state.push(action.payload)
        state.shift()
        return state
    }
    throw "unknown condition"
  }
  const [currentSaveData, setCurrentSaveData] = useReducer(reducerQueue, initQueue)


  const socket = props.socket;


  // load data
  useEffect(() => {
    if (socket == null || codedata == null ||documentId==null) return
    if (!loaded){
      if (codedata.client_id == socket.id){
        socket.emit("get-code-" + props.lan, documentId)
        console.log("get-code-" + props.lan);
      }
      socket.once("load-code-" + props.lan, loaded_data => {
        console.log("loading...1");
        if (loaded_data.length == 0 ) return
        console.log("load-code-"+props.lan,loaded_data);
        setLoaded(true)
        setCodeData(loaded_data)
        props.onChange(loaded_data.code);
        // console.log(data.code);
        
      })

    }
  
    // only emit when u are the modifying
    // if (codedata.client_id == socket.id){
    //   socket.emit("get-code-" + props.lan, documentId)
    //   console.log("get-code-" + props.lan);
    // }
    return () => {

    }
  }, [socket,codedata, documentId,loaded])


  // receiver
  useEffect(() => {
    if (socket == null | codedata == null) return
    const handler = (data) => {
      setCodeData(data);
      props.onChange(data.code);

      console.log(data)
    }
    
    socket.on("receive-changes-" + props.lan, handler);

    return () => {
      socket.off("receive-changes-" + props.lan);
    }
  }, [socket, codedata])


  const onChange = React.useCallback((event) => {
    const data = {
      _id: documentId,
      client_id: socket.id,
      code: event.target.value
    }
    setCodeData(data);
    props.onChange(event.target.value);
    setHasChange(true);
    // socket.emit("send-changes-" + props.lan, data);
    setCurrentSaveData({type: "enqueue", payload: data})

  }, [socket]);

  

  // only emit saving code if this client is modifying
  useEffect(() => {

    if( currentSaveData[1].code == null | socket ==null | codedata.code==null) return 
    if( currentSaveData[1].client_id != socket.id) return
    
    const interval = setInterval(() => {
      if (currentSaveData[1] == currentSaveData[0]) {
        clearInterval(interval)
        return
      }
      socket.emit('save-code-'+props.lan, currentSaveData[1])
      setCurrentSaveData({type: "enqueue", payload: currentSaveData[1]})
      console.log('save-code-'+props.lan, currentSaveData)

      
    }, SAVE_INTERVAL_MS)
    

    return () =>{
      clearInterval(interval)
    }
  }, [socket,currentSaveData,codedata])
  
  useEffect(() => {
    
    const interval = setInterval(() => {
      if(hasChange){
      // emit when user is modifying
      if (codedata.client_id == socket.id){
        socket.emit("get-code-" + props.lan, documentId)
        console.log("get-code-" + props.lan);
      }
      
      socket.emit("send-changes-" + props.lan, currentSaveData[1]);
      console.log("send-changes-" + props.lan);
      setHasChange(false);
      }
      else {
        clearInterval(interval)
      }
    }, 100);
      
    
    return () => {
      clearInterval(interval);
    }
  }, [hasChange])
  


  return (
    <textarea id={props.lan} onChange={onChange} value={codedata.code}></textarea>
  )
}

export default Editor