import React from "react";

function Home() {
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-4xl my-9 uppercase font-bold text-[#713687]">
        Register Now
      </h1>
      <iframe
        src="https://allevents.in/manage/tickets/book.php?event_id=80006843816682&auto_fill=1&platform=iframe&hide_details=1"
        className="w-full md:w-[70%] h-[518px] border-[1px] border-[#efefef]"
      ></iframe>
      <div className="">
        <img src="/logo2.png" className="w-[500px] my-9" alt="" />
      </div>
      {/* <div className="">
        <img src="/sponseredLogo.png" className="w-full my-9" alt="" />
      </div> */}
    </div>
  );
}

export default Home;
