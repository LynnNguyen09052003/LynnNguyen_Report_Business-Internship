import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Main from "./Main";

export default function Layout() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-app">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        <Main isExpanded={isExpanded} />
      </div>
    </div>
  );
}
