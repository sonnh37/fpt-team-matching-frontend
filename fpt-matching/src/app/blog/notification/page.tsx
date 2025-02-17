"use client";

import { Tabs } from "@/components/ui/tabs";
import React, { useState } from "react";

const notifications = [
  { id: 1, avatar: "https://via.placeholder.com/50", name: "Nguyễn Nhi", action: "đã mời bạn thích", target: "Let Me Cook", time: "1 ngày trước", type: "invite" },
  { id: 2, avatar: "https://via.placeholder.com/50", name: "Nguyen Vo Truc Ha", action: "gợi ý kết bạn mới", time: "3 ngày trước", type: "friend_suggestion" },
  { id: 3, avatar: "https://via.placeholder.com/50", name: "Lê Gia Huy", action: "Bạn đã nhận được huy hiệu fan cứng của", time: "3 ngày trước", type: "fan_badge" },
  { id: 4, avatar: "https://via.placeholder.com/50", name: "Lê Gia Huy", action: "Bạn đã nhận được huy hiệu fan cứng của", time: "1 tuần trước", type: "fan_badge" },
  { id: 5, avatar: "https://via.placeholder.com/50", name: "Nguyễn Văn A", action: "đã gửi lời mời kết bạn", time: "2 tuần trước", type: "friend_request" },
  { id: 6, avatar: "https://via.placeholder.com/50", name: "Trần B", action: "đã bình luận bài viết của bạn", time: "3 tuần trước", type: "comment" },
  { id: 7, avatar: "https://via.placeholder.com/50", name: "Nguyễn a", action: "đã thích bài viết của bạn", time: "1 tháng trước", type: "like" },
  { id: 8, avatar: "https://via.placeholder.com/50", name: "Nguyễn ", action: "đã thích bài viết của bạn", time: "1 tháng trước", type: "like" },
  { id: 9, avatar: "https://via.placeholder.com/50", name: "Nguyễn C", action: "đã thích bài viết của bạn", time: "1 tháng trước", type: "like" },
];

const chuadoc = [
  { id: 1, avatar: "https://via.placeholder.com/50", name: "Nguyễn Nhi", action: "đã mời bạn thích", target: "Let Me Cook", time: "1 ngày trước", type: "invite" },
  { id: 2, avatar: "https://via.placeholder.com/50", name: "Nguyen Vo Truc Ha", action: "gợi ý kết bạn mới", time: "3 ngày trước", type: "friend_suggestion" },
  { id: 3, avatar: "https://via.placeholder.com/50", name: "Lê Gia Huy", action: "Bạn đã nhận được huy hiệu fan cứng của", time: "3 ngày trước", type: "fan_badge" },
  { id: 4, avatar: "https://via.placeholder.com/50", name: "Lê Gia Huy", action: "Bạn đã nhận được huy hiệu fan cứng của", time: "1 tuần trước", type: "fan_badge" },
  { id: 5, avatar: "https://via.placeholder.com/50", name: "Nguyễn Văn A", action: "đã gửi lời mời kết bạn", time: "2 tuần trước", type: "friend_request" },
  { id: 6, avatar: "https://via.placeholder.com/50", name: "Trần B", action: "đã bình luận bài viết của bạn", time: "3 tuần trước", type: "comment" },
  { id: 7, avatar: "https://via.placeholder.com/50", name: "Nguyễn a", action: "đã thích bài viết của bạn", time: "1 tháng trước", type: "like" },
  { id: 8, avatar: "https://via.placeholder.com/50", name: "Nguyễn ", action: "đã thích bài viết của bạn", time: "1 tháng trước", type: "like" },
  { id: 9, avatar: "https://via.placeholder.com/50", name: "Nguyễn C", action: "đã thích bài viết của bạn", time: "1 tháng trước", type: "like" },
];
const Notification = () => {
//   const [showAll, setShowAll] = useState(false);

//   const handleShowAll = () => {
//     setShowAll(!showAll);
//   };

// const visibleNotifications = showAll ? notifications : notifications.slice(0, 6);

const tabs = [
  {
    title: "Tất cả",
    value: "tatca",
    content: (
      <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-black bg-white">
        <p>Tất cả</p>
        <p className="text-xl font-semibold mb-4">Trước đó</p>

        {/* Danh sách thông báo */}
        <div className={`space-y-4 max-h-96 overflow-y-auto`}>
          {notifications.map((noti) => (
            <div key={noti.id} className="flex items-start space-x-3 p-3 hover:bg-gray-100 rounded-lg">
              <img className="w-10 h-10 rounded-full" src={noti.avatar} alt={noti.name} />
              <div className="flex-1">
                <p className="text-gray-800 text-sm">
                  <span className="font-semibold">{noti.name}</span> {noti.action}{" "}
                  {noti.target && <span className="font-semibold">{noti.target}</span>}.
                </p>
                <p className="text-gray-500 text-xs">{noti.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Nút "Xem thêm" / "Thu gọn"
          {notifications.length > 6 && (
            <button
              className="mt-4 px-4 py-2 bg-gray-200 text-black text-sm rounded-lg w-full hover:bg-gray-300"
              onClick={handleShowAll}
            >
              {showAll ? "Thu gọn" : "Xem thêm"}
            </button>
          )} */}
      </div>
    ),
  },
  {
    title: "Chưa đọc",
    value: "chuadoc",
    content: (
      <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-black bg-white">
      <p>Tất cả</p>
      <p className="text-xl font-semibold mb-4">Trước đó</p>

      {/* Danh sách thông báo */}
      <div className={`space-y-4 max-h-96 overflow-y-auto`}>
        {chuadoc.map((noti) => (
          <div key={noti.id} className="flex items-start space-x-3 p-3 hover:bg-gray-100 rounded-lg">
            <img className="w-10 h-10 rounded-full" src={noti.avatar} alt={noti.name} />
            <div className="flex-1">
              <p className="text-gray-800 text-sm">
                <span className="font-semibold">{noti.name}</span> {noti.action}{" "}
                {noti.target && <span className="font-semibold">{noti.target}</span>}.
              </p>
              <p className="text-gray-500 text-xs">{noti.time}</p>
            </div>
          </div>
        ))}
      </div>
      </div>
    ),
  },
];

return (
  <div className="bg-slate-200 pb-10">
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full items-start justify-start pt-4">
      <Tabs tabs={tabs} />
    </div>
  </div>
);
};

export default Notification;
