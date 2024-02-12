import React from "react";
import { Routes, Route } from "react-router-dom";
import Success from "../Pages/Success";
import Share from "../Pages/Share.tsx";
import Home from "../Pages/Home";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/success" element={<Success />} />
      <Route path="/share" element={<Share />} />
    </Routes>
  );
};

export default Routers;
