import React from "react";
import ReactDOM from "react-dom/client";
// import cRender from "./cRender.js";
import "./index.css";
import App from "./App";
import cRender from "creact-visualizer";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

const root = document.getElementById("root");

cRender(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  root
);
