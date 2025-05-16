"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, FileSearch } from "lucide-react";

function PageIsTopic() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="max-w-md w-full bg-card rounded-xl shadow-lg border p-8 text-center space-y-6 animate-fade-in">
        <div className="flex justify-center">
          <div className="bg-primary/10 p-4 rounded-full">
            <Clock className="h-10 w-10 text-primary" strokeWidth={1.5} />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Đang chờ phê duyệt
          </h2>
          <p className="text-muted-foreground">
            Topic của bạn đã được gửi đi. Vui lòng chờ trong khi chúng tôi xem xét yêu cầu của bạn.
          </p>
        </div>

        <Button
          onClick={() => (window.location.href = "/topic/request")}
          className="gap-2"
        >
          <FileSearch className="w-5 h-5" />
          Theo dõi trạng thái
        </Button>
      </div>
    </div>
  );
}

export default PageIsTopic;