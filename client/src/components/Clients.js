import React from 'react'
import EditorPage from '../pages/EditorPage'
import Avatar from "react-avatar"

const Clients = ({userName}) => {
    console.log(userName);
  return (
    <div className='client'>
        <Avatar name={userName} round="14px" size={50}/>
        <span className='userName'>{userName}</span>
    </div>
  )
}

export default Clients