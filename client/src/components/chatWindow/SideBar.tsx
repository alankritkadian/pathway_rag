import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import StarsCanvas from "../landingPage/StarBackground";
import ChatCanvas from "./ChatBackground";
import Navbar from "../landingPage/navbar/Navbar";
import AiChat from "./AIChat";
import Flow from "./Tree";

const SideBar = () => {
  return (
    <div className="h-screen w-max bg-[#030014] overflow-y-hidden overflow-x-scroll">
      <div className="ml-64"><Navbar type="chat" /></div>
      <SidebarProvider className="z-50 h-screen">
      <ChatCanvas/>
        <AppSidebar className="z-40 absolute  bg-transparent"/>
        <SidebarInset className=" z-40 bg-transparent ">
          <header className=" flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4 ">
              <SidebarTrigger className="-ml-1  text-gray-300" />
              <Separator orientation="vertical" className="mr-2 h-4 " />
              <Breadcrumb >
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block ">
                    <BreadcrumbLink href="#" className="text-gray-200 hover:text-gray-500">
                      Chat with our model
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white">Decision tree</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
             
            </div>
            
          </header>
          <div className='flex flex-row w-max'>
        <div className='flex'><AiChat/></div>
        <div className='flex overflow-x-scroll'><Flow/></div>
      </div>
         
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default SideBar;
