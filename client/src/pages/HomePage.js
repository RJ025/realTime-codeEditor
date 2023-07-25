import React, { useState } from 'react'
import {v4} from "uuid"
import {Toast, toast} from "react-hot-toast"
import { useNavigate } from 'react-router-dom'
import '../App.css'

const HomePage = () => {

  const[roomId  , setRoomId] = useState("");
  const[userName  , setUserName] = useState("");
  const navigate = useNavigate();

  const createNewRoom = (e)=>{
    e.preventDefault();
    const id = v4()
    console.log(id)
    setRoomId(id);
    if(id)toast.success("New Room Id Generated")
    else toast.error("something went wrong");
  }
  
  const joinRoom = ()=>{
    if(!roomId ||  !userName){
      toast.error("enter room ID and userName");
      return;
    }

    navigate(`/editor/${roomId}` , {
      state:{
        userName
      }
    })
  }

  const handleInputEnter = (e) => {
    if (e.code === 'Enter') {
        joinRoom();
    }
   };

  return (
    <div className='homePageWrapper'>
      <div className='formWrapper'>
        <img className='homePageLoggo' src='/code-sync.png'></img>
        <h4 className='mainLabel'>Enter Room ID</h4>
          <div className='inputGroup'>
            <input onKeyUp={handleInputEnter} onChange={(e)=>setRoomId(e.target.value)} type='text' className='inputBox' placeholder='ROOM ID' value={roomId}></input>
            <input onKeyUp={handleInputEnter} onChange={(e)=>setUserName(e.target.value)} type='text' className='inputBox' placeholder='USERNAME' value={userName}></input>
            <button onClick={joinRoom} className='btn joinBtn '>JOIN</button>
            <span className='createInfo'>Create Room</span>
            <a onClick={createNewRoom} href='' className='createNewBtn'>New Room</a>
          </div>
        
      </div>
    </div>
  )
}

export default HomePage