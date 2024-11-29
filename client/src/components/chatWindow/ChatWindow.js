import React from 'react'
import Navbar from '../landingPage/navbar/navbar'
import StarsCanvas from '../landingPage/StarBackground'
import AiChat from './AIChat'

function ChatWindow() {
  return (
    <main className="h-full w-full bg-[#030014] overflow-y-scroll overflow-x-hidden">
    <div className="flex flex-col gap-5">
      <StarsCanvas/>
      <Navbar type = "chat" />
      <AiChat/>
    </div>
    </main>
  )
}

export default ChatWindow