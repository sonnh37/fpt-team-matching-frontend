import { Separator } from "@/components/ui/separator";
import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";
import { HeaderMain } from "./header-main";
import { HeaderTop } from "./header-top";

export function Header() {
  const user = useSelector((state: RootState) => state.user!.user);

  return (
    <>
      <HeaderTop />
      <HeaderMain user={user} />
    </>
  );
}
