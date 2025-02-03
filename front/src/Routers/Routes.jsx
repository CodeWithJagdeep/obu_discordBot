import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import { Home, Login } from "./Links";

function RouteConfig() {
  return (
    <Router>
      <Routes>
        <Route path="/:type" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default RouteConfig;
