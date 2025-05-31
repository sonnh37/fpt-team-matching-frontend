"use client";
import { TopicStatus } from "@/types/enums/topic";
import { Button } from "@/components/ui/button";
import { Clock, FileSearch, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Topic } from "@/types/topic";

interface TopicApprovalStatusProps {
  topic: Topic;
  isStudent: boolean;
}

export function TopicApprovalStatus({ topic, isStudent }: TopicApprovalStatusProps) {
  if (!isStudent || !topic?.status) return null;

  const status = 
    topic.status === TopicStatus.ManagerApproved ? "approved" :
    [TopicStatus.ManagerRejected, TopicStatus.MentorRejected].includes(topic.status) ? "rejected" :
    "pending";

  const topicName = topic.englishName || topic.vietNameseName || "Unnamed Topic";

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex justify-center items-center p-4">
      {/* Pending State */}
      {status === "pending" && (
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
              Topic <span className="font-semibold text-foreground">${topicName}</span> đã được gửi đi.
              Vui lòng chờ trong khi chúng tôi xem xét yêu cầu của bạn.
            </p>
          </div>

          <Button asChild className="gap-2">
            <Link href="/topic/request">
              <FileSearch className="w-5 h-5" />
              Theo dõi trạng thái
            </Link>
          </Button>
        </div>
      )}

      {/* Approved State */}
      {status === "approved" && (
        <div className="max-w-md w-full bg-card rounded-xl shadow-lg border p-8 text-center space-y-6 animate-fade-in">
          <div className="flex justify-center">
            <div className="bg-green-100 p-4 rounded-full dark:bg-green-900/30">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" strokeWidth={1.5} />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Topic đã được duyệt
            </h2>
            <p className="text-muted-foreground">
              Topic <span className="font-semibold text-foreground">${topicName}</span> đã được phê duyệt.
              {topic.project ? (
                " Bạn có thể bắt đầu làm việc trên topic này."
              ) : (
                " Dự án sẽ sớm được tạo tự động."
              )}
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <Button asChild variant="outline">
              <Link href="/topic/request">
                Xem chi tiết
              </Link>
            </Button>
            {topic.project && (
              <Button asChild>
                <Link href={`/team`}>
                  Truy cập dự án
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Rejected State */}
      {status === "rejected" && (
        <div className="max-w-md w-full bg-card rounded-xl shadow-lg border p-8 text-center space-y-6 animate-fade-in">
          <div className="flex justify-center">
            <div className="bg-red-100 p-4 rounded-full dark:bg-red-900/30">
              <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" strokeWidth={1.5} />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Topic đã bị từ chối
            </h2>
            <p className="text-muted-foreground">
              Topic <span className="font-semibold text-foreground">${topicName}</span> không được phê duyệt.
            </p>
            
          </div>

          <div className="flex gap-3 justify-center">
            <Button asChild variant="outline">
              <Link href="/topic/request">
                Xem chi tiết
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/topic/edit/${topic.id}`}>
                Chỉnh sửa topic
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}