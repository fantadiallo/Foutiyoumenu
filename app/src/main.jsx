import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/globals.scss";
import { RestaurantConfigProvider } from "./config/useRestaurantConfig";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <RestaurantConfigProvider>
      <App />
    </RestaurantConfigProvider>
  </BrowserRouter>
);
