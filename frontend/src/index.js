import React    from "react";
import ReactDOM from "react-dom/client";
import App      from "./App";

// Global dark mode styles
const style = document.createElement("style");
style.innerHTML = `
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    background: #0f0f1a;
    color: white;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    min-height: 100vh;
  }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #0f0f1a; }
  ::-webkit-scrollbar-thumb { background: #e94560; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #c73652; }
  @keyframes spin {
    0%  { transform: rotate(0deg); }
    100%{ transform: rotate(360deg); }
  }
  @keyframes fadeIn {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes pulse {
    0%,100% { opacity:1; }
    50%      { opacity:0.5; }
  }
  @keyframes glow {
    0%,100% { box-shadow: 0 0 10px rgba(233,69,96,0.3); }
    50%      { box-shadow: 0 0 25px rgba(233,69,96,0.7); }
  }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);