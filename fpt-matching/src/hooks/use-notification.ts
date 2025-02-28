import { notificationService } from "@/services/notification-service";
import { NotificationGetAllByCurrentUserQuery } from "@/types/models/queries/notifications/notifications-get-all-by-current-user-query";
import { BusinessResult } from "@/types/models/responses/business-result";
import { Notification } from "@/types/notification";
import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from "react";

export default function useNotification(query: NotificationGetAllByCurrentUserQuery) {
  console.log("query in useNotification:", query); // 🔥 Kiểm tra giá trị nhận được

  const [businessResult, setBusinessResult] =
    useState<BusinessResult<PaginatedResult<Notification>>>();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchAllNotifications = async () => {
      try {
        const response = await notificationService.fetchPaginatedByCurrentUser(query);
        console.log("check_noti", response);
        setBusinessResult(response);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchAllNotifications();
  }, []);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_API_BASE}/notification`, {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNotification", (notification: Notification) => {

      setBusinessResult((prev) => {
        if (!prev || !prev.data) {
          return {
            status: 1,
            message: "Success",
            data: {
              results: [notification],
              totalPages: 1,
              totalRecordsPerPage: 1,
              totalRecords: 1,
              pageNumber: 1,
              pageSize: 1,
            },
          };
        }

        const updatedResults = [notification, ...prev.data.results!];
        return {
          ...prev,
          data: {
            ...prev.data,
            results: updatedResults,
            totalRecords: prev.data.totalRecords! + 1,
          },
        };
      });
    });

    // Bắt đầu kết nối SignalR
    connection
      .start()
      .then(() => {
        console.log("✅ Connected to SignalR");
        setIsConnected(true);
      })
      .catch((err) => {
        console.error("❌ SignalR Connection Error:", err);
        setIsConnected(false);
      });

    return () => {
      connection.stop();
    };
  }, []);

  return { businessResult, isConnected };
}
