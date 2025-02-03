import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import { Home, Login } from "./Links";
import Gifs from "../pages/Selected/Gifs";

function RouteConfig() {
  return (
    <Router>
      <Routes>
        <Route path="/:type" element={<Home />} />
        <Route path="/overview/:type" element={<Gifs />} />
      </Routes>
    </Router>
  );
}

export default RouteConfig;
