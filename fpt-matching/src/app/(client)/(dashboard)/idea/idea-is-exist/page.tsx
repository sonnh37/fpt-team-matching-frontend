"use client";
import React from "react";
import Loader from "@/components/_common/waiting-icon/page";
import { Button } from "@/components/ui/button";
function PageIsIdea() {
  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-3xl text-red-500 text-center">
          Bạn đã tạo idea rồi hãy chờ đợi kết quả duyệt nha
        </div>
        <Button
          variant={"default"}
          onClick={() => (window.location.href = "/idea/request")}
        >
          Xem Duyệt
        </Button>
        <Loader />
      </div>
    </div>
  );
}

export default PageIsIdea;
