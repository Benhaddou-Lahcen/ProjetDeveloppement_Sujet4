import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
import { AuthProvider } from "./auth/AuthContext";

console.log("[v0] main.tsx: initializing app");

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("[v0] Root element not found");
} else {
  console.log("[v0] Root element found, mounting app");
}

ReactDOM.createRoot(rootElement as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

