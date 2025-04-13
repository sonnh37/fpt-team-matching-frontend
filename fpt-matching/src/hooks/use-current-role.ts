import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";

export const useCurrentRole = () => {
  return useSelector((state: RootState) => state.cache.cache.role);
};

export const useCurrentTheme = () => {
  return useSelector((state: RootState) => state.cache.cache.theme);
};
