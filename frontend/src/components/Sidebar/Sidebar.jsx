import React, { useContext, useState } from 'react'
import './Sidebar.css'
import {assets} from '../../assets/assets'
import { Context } from '../../context/Context'

const Sidebar = () => {

    const [extended,setExtended] = useState(false)
    const {onSent,prevPrompts,setRecentPrompt,newChat,chatSessions,loadChatSession} = useContext(Context)

  const loadPrompt = async(prompt) => {
    // Start a new chat when loading a previous prompt
    newChat()
    setRecentPrompt(prompt)
    await onSent(prompt)
  }

  return (
    <div className='sidebar'>
      <div className="top">
        <img onClick={()=>setExtended(prev=>!prev)} className='menu' src={assets.menu_icon} alt="Menu icon" />
        <div onClick={()=>newChat()} className="new-chat">
            <img src={assets.plus_icon} alt="" />
            {extended?<p>New Chat</p>:null}
        </div>
        {extended
        ?<div className="recent">
            <p className="recent-title">Recent</p>
            {chatSessions.length > 0 ? (
              chatSessions.map((session,index)=>{
                return (
                  <div key={session.id} onClick={()=>loadChatSession(session)} className="recent-entry">
                    <img src={assets.message_icon} />
                    <p>{session.title.length > 18 ? session.title.slice(0,18) + '...' : session.title}</p>
                  </div>
                )
              })
            ) : (
              prevPrompts.map((item,index)=>{
                return (
                  <div key={index} onClick={()=>loadPrompt(item)} className="recent-entry">
                    <img src={assets.message_icon} />
                    <p>{item.slice(0,18)} ...</p>
                  </div>
                )
              })
            )}
            
        </div>
        :null}
        
      </div>

      <div className="bottom">
        <div className="bottom-item recent-entry">
            <img src={assets.question_icon} alt=''/>
            {extended?<p>Help</p>:null}
        </div>

        <div className="bottom-item recent-entry">
            <img src={assets.history_icon} alt=''/>
            {extended?<p>Activity</p>:null}
        </div>

        <div className="bottom-item recent-entry">
            <img src={assets.setting_icon} alt=''/>
            {extended?<p>Settings</p>:null}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
