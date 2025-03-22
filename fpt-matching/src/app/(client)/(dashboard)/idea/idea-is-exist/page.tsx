"use client";
import React from "react";
import Loader from "@/components/_common/waiting-icon/page";
import { Button } from "@/components/ui/button";
function PageIsIdea() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full m-0">
      <div className="text-3xl text-red-500 pb-4">
        Bạn đã tạo idea rồi hãy chờ đợi kết quả duyệt nha
      </div>
      <div className="text-3xl pb-4 flex items-center justify-center">
        <Button
        variant={"secondary"}
          onClick={() => (window.location.href = "/idea/request")}
        >
          Xem Duyệt
        </Button>
        {/* <button className="bg-slate-50 ">Xem gì đó</button> */}
      </div>
      <div className="">
        <Loader />
      </div>
    </div>
  );
}

export default PageIsIdea;
