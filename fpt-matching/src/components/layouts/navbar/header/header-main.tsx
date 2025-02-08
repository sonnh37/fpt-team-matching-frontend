import { useScrollVisibility } from "@/hooks/use-scroll-visibility";
import { navbarConst } from "@/lib/constants/navbar-const";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import MainNav and MobileNav with React.memo
const MainNav = dynamic(
  () => import("../main-nav").then((mod) => mod.MainNav),
  { ssr: false }
);
const MobileNav = dynamic(
  () => import("../mobile-nav").then((mod) => mod.MobileNav),
  { ssr: false }
);

interface HeaderMainProps {
  user?: User | null;
}

export const HeaderMain = ({ user }: HeaderMainProps) => {
  const { visible, isTop } = useScrollVisibility();

  return (
    <div
      className={cn(
        "sticky top-0 z-10 bg-primary w-full transition-colors duration-300 tracking-wider text-sm",
        "",
        "group backdrop-blur-3xl"
      )}
    >
      <div className="w-full flex justify-center">
        <div className="container flex h-14 items-center justify-between mx-auto">
          <MainNav user={user}/>
          <MobileNav items={navbarConst.mainNav} user={user} />
        </div>
      </div>
    </div>
  );
};
