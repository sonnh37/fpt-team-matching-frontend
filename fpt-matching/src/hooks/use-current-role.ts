import { RootState } from "@/lib/redux/store";
import { semesterService } from "@/services/semester-service";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useSelectorUser } from "./use-auth";

export const useCurrentRole = () => {
  return useSelector((state: RootState) => state.cache.cache.role);
};

export const useCurrentTheme = () => {
  return useSelector((state: RootState) => state.cache.cache.theme);
};
export function useCurrentSemester() {
  const user = useSelectorUser();
  const semesterId = useSelector(
    (state: RootState) => state.cache.cache.semester
  );
  const {
    data: semestersData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getAllSemester"],
    queryFn: () => semesterService.getAll(),
    refetchOnWindowFocus: false,
  });

  const semesterList = semestersData?.data?.results || [];

  const getCurrentSemester = () => {
    if (isLoading || isError || semesterList.length === 0) {
      return undefined;
    }

    // 1. Ưu tiên semester từ cache nếu có
    if (semesterId) {
      const cachedSemester = semesterList.find((s) => s.id === semesterId);
      if (cachedSemester) return cachedSemester;
    }

    // 2. Kiểm tra nếu user có role Admin/Manager/Lecturer
    const isAdminRole = user?.userXRoles?.some((role) =>
      ["Admin", "Manager"].includes(role.role?.roleName || "")
    );

    if (isAdminRole) {
      // Lấy semester mới nhất (createdDate lớn nhất)
      return [...semesterList].sort(
        (a, b) =>
          new Date(b.createdDate || 0).getTime() -
          new Date(a.createdDate || 0).getTime()
      )[0];
    }

    // 3. Lấy semester mới nhất từ user (nếu có)
    if ((user?.userXRoles ?? []).length > 0) {
      const userSemesterIds = user?.userXRoles.map((r) => r.semesterId);
      const userSemesters = semesterList.filter((s) =>
        userSemesterIds?.includes(s.id)
      );

      if (userSemesters.length > 0) {
        return [...userSemesters].sort(
          (a, b) =>
            new Date(b.createdDate || 0).getTime() -
            new Date(a.createdDate || 0).getTime()
        )[0];
      }
    }

    // 4. Fallback: lấy semester mới nhất từ tất cả
    return [...semesterList].sort(
      (a, b) =>
        new Date(b.createdDate || 0).getTime() -
        new Date(a.createdDate || 0).getTime()
    )[0];
  };

  const currentSemester = getCurrentSemester();

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
