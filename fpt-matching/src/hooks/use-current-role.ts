import { RootState } from "@/lib/redux/store";
import { semesterService } from "@/services/semester-service";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useSelectorUser } from "./use-auth";
import { useMemo } from "react";

export const useCurrentRole = () => {
  return useSelector((state: RootState) => state.cache.cache.role);
};

export const useCurrentTheme = () => {
  return useSelector((state: RootState) => state.cache.cache.theme);
};
export function useCurrentSemester() {
 const user = useSelectorUser();
  const cachedSemesterId = useSelector((state: RootState) => state.cache.cache.semester);
  
  // Lấy danh sách semester với cache 5 phút
  const { data, isLoading, isError } = useQuery({
    queryKey: ["semesters"],
    queryFn: () => semesterService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 phút
    refetchOnWindowFocus: false,
  });

  // Memoize để tránh tính toán lại không cần thiết
  const { currentSemester, semesterList } = useMemo(() => {
    const semesterList = data?.data?.results || [];
    
    // Hàm chọn semester hiện tại
    const getCurrentSemester = () => {
      if (isLoading || isError || semesterList.length === 0) {
        return undefined;
      }

      // 1. Ưu tiên semester từ cache nếu có
      if (cachedSemesterId) {
        const cachedSemester = semesterList.find(s => s.id === cachedSemesterId);
        if (cachedSemester) return cachedSemester;
      }

      // 2. Kiểm tra role Admin/Manager/Lecturer
      const isAdmin = user?.userXRoles?.some(role => 
        ["Admin", "Manager", "Lecturer"].includes(role.role?.roleName || "")
      );

      // 3. Lọc semester theo user roles nếu không phải admin
      const userSemesters = !isAdmin 
        ? semesterList.filter(s => 
            user?.userXRoles?.some(role => role.semesterId === s.id)
          )
        : semesterList;

      // 4. Sắp xếp theo createdDate giảm dần
      const sortedSemesters = [...userSemesters].sort((a, b) => 
        new Date(b.createdDate || 0).getTime() - new Date(a.createdDate || 0).getTime()
      );

      return sortedSemesters[0]; // Lấy semester mới nhất
    };

    return {
      currentSemester: getCurrentSemester(),
      semesterList
    };
  }, [data, isLoading, isError, cachedSemesterId, user]);

  return {
    currentSemester,
    semesterList,
    isLoading,
    isError,
  };
}

export const useCurrentSemesterId = () => {
  return useSelector((state: RootState) => state.cache.cache.semester);
};
