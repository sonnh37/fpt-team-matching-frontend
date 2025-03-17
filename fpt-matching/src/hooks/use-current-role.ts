import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";

export const useCurrentRole = () => {
  return useSelector((state: RootState) => state.role.currentRole);
};
