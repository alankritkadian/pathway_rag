import React from "react";
import Navbar from "@/components/landingPage/navbar/Navbar";
import StarsCanvas from "@/components/landingPage/StarBackground";
import AiChat from "@/components/chatWindow/AIChat";
import Flow from "@/components/chatWindow/Tree";
import SideBar from "@/components/chatWindow/SideBar";

function ChatWindow() {
  return (
    // <main className="h-full w-max bg-[#030014] overflow-y-scroll overflow-x-hidden">
    // <div className="flex flex-col gap-5">
    //   <StarsCanvas/>
    //   <Navbar type="chat"/>
    //   <div className='flex flex-row'>
    //     <div className='flex'><SideBar/></div>
    //     <div className='flex'><AiChat/></div>
    //     <div className='flex overflow-x-scroll'><Flow/></div>
    //   </div>
    // </div>
    // </main>
    <div >
       
      <SideBar/>
      {/* <div className='flex'><AiChat/></div> */}
      {/* <StarsCanvas/> */}
    </div>
  );
}

export default ChatWindow;
