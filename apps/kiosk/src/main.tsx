import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ScreenProvider } from "./state/useScreen";
import "./index.css";
import { OrderProvider } from "./hooks/useOrder";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <OrderProvider>
      <ScreenProvider>
        <App />
      </ScreenProvider>
    </OrderProvider>
  </React.StrictMode>
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
