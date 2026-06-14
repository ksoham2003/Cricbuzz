import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import useSidebar from "../hooks/useSidebar";

const LandingLayout = () => {
  const { isOpen, open, close } = useSidebar();

  return (
    <>
      <Navbar onMenuClick={open} />
      <Sidebar isOpen={isOpen} onClose={close} />
      <Outlet />
    </>
  );
};

export default LandingLayout;
