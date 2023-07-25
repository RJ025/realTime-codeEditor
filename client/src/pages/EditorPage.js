import React, { useEffect, useRef, useState } from 'react'
import Clients from '../components/Clients'
import { Navigate, useLocation , useNavigate , useParams } from 'react-router-dom'
import Editor from '../components/Editor'
import { initSocket } from '../socket'
import ACTIONS from '../actions'
import { toast } from 'react-hot-toast'


const EditorPage = () => {

  const socketRef = useRef(null);  //useRef does not rerender the page isme hum aisa data rakhte hai jo baar 
                                  //multiple render pum hme available ho aur uske chnage hone se component rerender naa ho
                                  //normal useState rerender the component
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigate = useNavigate();
  const params = useParams();
  const [clients , setClients] = useState([])

  useEffect(()=>{
    const init = async()=>{
      socketRef.current = await initSocket();

      const handleErrors = (err)=>{
        console.log('socket error' , err);
        toast.error('socket connection failed , try again later');
        reactNavigate('/');
      }

      socketRef.current.on('connect_error' , (err)=>handleErrors(err))
      socketRef.current.on('connect_failed' , (err)=>handleErrors(err));
      socketRef.current.emit(ACTIONS.JOIN , {
        roomId : params.roomId ,
        userName : location.state?.userName
      })

      // listening for joined event
      socketRef.current.on(ACTIONS.JOINED , ({clients , userName , socketId})=>{
        if(userName !== location.state.userName){
          toast.success(`${userName} joined the room`);
          console.log(`${userName} joined`)
        }
        console.log(clients);
        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE , {
          code : codeRef.current ,
          socketId
        })
      })

      // listening to disconnecting
      socketRef.current.on(ACTIONS.DISCONNECTED , ({socketId , userName})=>{
        toast.success(`${userName} left the chat`);
        setClients((prev)=>{
          return prev.filter(client=>client.socketId!==socketId)
        })
      })
    }
    init();
    return ()=>{
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED)
      socketRef.current.off(ACTIONS.DISCONNECTED)

    }
  } ,[])


  if(!location.state){
    return <Navigate to="/"/>
  }

  const copyRoomId = async()=>{
    try{
      await navigator.clipboard.writeText(params.roomId);
      toast.success('room ID copied')
    }
    catch(error){
      console.log(error);
      toast.error('error occured');
    }
  }

  const leaveRoom = ()=>{
    reactNavigate('/')
  }

  

  return (
    <div className='mainWrap'>
      <div className='aside'>
        <div className='asideInner'>
          <h3>Connected</h3>
          <div className='clientsList'>
            {
              clients.map(client=>{
                return <Clients key={client.socketId} userName={client.userName}/>
              })
            }
          </div>
        </div>
        <button onClick={copyRoomId} className='btn copyBtn'>Copy ROOM ID</button>
        <button onClick={leaveRoom} className='btn leaveBtn'>Leave</button>
      </div>
      <div className='editorWrap'>
        <Editor socketRef={socketRef} roomId = {params.roomId} onCodeChange={(code)=>{
          codeRef.current = code
        }}/>
      </div>
    </div>
  )
}

export default EditorPage