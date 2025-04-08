"use client";

export const HasTeam = () => {
  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <div className="flex flex-col gap-4">
        <div className="text-3xl text-red-500 pb-4 text-center">
          Bạn đã tham gia một team trong kỳ này.Làm ơn kiểm tra kỹ lại chi tiết.
        </div>
      </div>
    </div>
  );
};
