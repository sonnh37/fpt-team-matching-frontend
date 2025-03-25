
interface PaginationProps {
  currentPage: number;       // Trang hiện tại (bắt buộc kiểu number)
  totalPages: number;        // Tổng số trang
  onPageChange: (page: number) => void; // Hàm xử lý khi chuyển trang
}


const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const maxPageNumbers = 5; // Hiển thị tối đa 5 trang cùng lúc

  // Xác định phạm vi số trang hiển thị
  const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - maxPageNumbers + 1));
  const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

  return (
    <div className="flex justify-center space-x-2 mt-4 mb-4">
      {/* Nút Prev (bị vô hiệu hóa nếu ở trang 1) */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1} // Chặn bấm khi ở trang 1
        className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"
          }`}
      >
        Prev
      </button>


      {/* Render danh sách số trang */}
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${page === currentPage
              ? "bg-blue-500 text-white border border-blue-700 font-bold" // Trang hiện tại có màu khác
              : "bg-gray-200 hover:bg-gray-300"
            }`}
        >
          {page}
        </button>
      ))}

      {/* Nút Next (bị vô hiệu hóa nếu ở trang cuối) */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages} // Chặn bấm khi ở trang cuối
        className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"
          }`}
      >
        Next
      </button>
    </div>
  );
};
export {
  Pagination,
}
