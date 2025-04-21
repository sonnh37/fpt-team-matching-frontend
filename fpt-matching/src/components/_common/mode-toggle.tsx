"use client";

import { Button } from "@/components/ui/button";
import {
  updateLocalCache,
  updateUserCache
} from "@/lib/redux/slices/cacheSlice";
import { AppDispatch } from "@/lib/redux/store";
import { IconBrightness } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

export function ModeToggle() {
  const dispatch = useDispatch<AppDispatch>();

  const { setTheme, resolvedTheme } = useTheme();

  const handleThemeToggle = useCallback(
    (e?: React.MouseEvent) => {
      const newMode = resolvedTheme === "dark" ? "light" : "dark";
      const root = document.documentElement;

      if (!document.startViewTransition) {
        setTheme(newMode);
        dispatch(updateLocalCache({ theme: newMode }));
        dispatch(
          updateUserCache({
            theme: newMode,
          })
        );
        return;
      }

      // Set coordinates from the click event
      if (e) {
        root.style.setProperty("--x", `${e.clientX}px`);
        root.style.setProperty("--y", `${e.clientY}px`);
      }

      document.startViewTransition(() => {
        setTheme(newMode);
        dispatch(updateLocalCache({ theme: newMode }));
        dispatch(
          updateUserCache({
            theme: newMode,
          })
        );
      });
    },
    [resolvedTheme, setTheme]
  );

  return (
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button variant="secondary" className="size-10 focus-visible:ring-0">
    //       <SunIcon
    //         strokeWidth={1.5}
    //         className="!size-4 text-foreground/80 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
    //       />
    //       <MoonIcon
    //         strokeWidth={1.5}
    //         className="!size-4 text-foreground/80 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
    //       />
    //       <span className="sr-only">Toggle theme</span>
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align="end">
    //     <DropdownMenuItem onClick={() => handleThemeChange("light")}>
    //       <SunIcon className="mr-2 size-4" />
    //       <span>Sáng</span>
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
    //       <MoonIcon className="mr-2 size-4" />
    //       <span>Tối</span>
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => handleThemeChange("system")}>
    //       <LaptopIcon className="mr-2 size-4" />
    //       <span>Hệ thống</span>
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
    <Button
      variant="secondary"
      size="icon"
      className="group/toggle size-10"
      onClick={handleThemeToggle}
    >
      <IconBrightness strokeWidth={1.5} className="!size-5"/>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
