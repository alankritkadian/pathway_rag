import React from 'react'
import Logo from './logo';
import { NavigationMenuDemo } from './navigationMenu';
import ChatNavbar from './ChatNavbar';

function Navbar({type}) {
  return (
    <div className="px-5 flex h-16 items-center border-b border-transparent  top-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001417] backdrop-blur-md z-50 w-full ">
      <div data-testid="logo">
        <Logo />
      </div>
      {type === 'home' ? (
        <div className="mx-auto" data-testid="navigation-menu-bar">
          <NavigationMenuDemo />
        </div>
      ) : null}
      {type === 'chat' ? (
        <div className="ml-auto" data-testid="navigation-menu-bar">
          <ChatNavbar/>
        </div>
      ) : null}
    </div>
  )
}

export default Navbar