import React, { useState, useEffect } from "react";
// bg-[#713687]
function Header() {
  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;
  return (
    <div className="w-full">
      {!isMobile && <img src="/Banner.jpg" className="w-full" alt="" />}
      {isMobile && <img src="/MobileBanner.jpg" className="w-full" alt="" />}
    </div>
  );
}

export default Header;
