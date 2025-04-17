import { notificationService } from "@/services/notification-service";
import { NotificationGetAllByCurrentUserQuery } from "@/types/models/queries/notifications/notifications-get-all-by-current-user-query";
import { Notification } from "@/types/notification";
import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from "react";

export default function useNotification(
  query: NotificationGetAllByCurrentUserQuery
) {
  const [notifications, setNotifications] = useState<Notification[]>();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchAllNotifications = async () => {
      try {
        const response = await notificationService.getAllByCurrentUser(
          query
        );
        setNotifications(response.data?.results);
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
      setNotifications((prev: Notification[] | undefined) => {
        if (!prev) return [notification];
        const updatedResults = [notification, ...prev];
        return updatedResults;
      });
    });

    connection
      .start()
      .then(() => {
        setIsConnected(true);
      })
      .catch((err) => {
        setIsConnected(false);
      });

    return () => {
      connection.stop();
    };
  }, []);

  return { notifications, isConnected };
}
