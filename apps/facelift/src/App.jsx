import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "../src/components/component-styles.css";
import FeedView from "./components/FeedView";
import HubView from "./components/HubView";
import DesktopSidebar from "./components/DesktopSidebar";
import DesktopNotificationWidget from "./components/DesktopNotificationWidget";

function App() {
  const [showFeed, setShowFeed] = useState(true);
  return (
    <>
      <DesktopSidebar></DesktopSidebar>
      <DesktopNotificationWidget></DesktopNotificationWidget>
      {showFeed ? <FeedView></FeedView> : <HubView></HubView>}
    </>
  );
}

export default App;
