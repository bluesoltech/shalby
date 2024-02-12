import React from "react";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import Routers from "../Routers/Routers";

function Layout() {
  return (
    <div className="h-full">
      <Header />
      <Routers />
      <Footer />
    </div>
  );
}

export default Layout;
