"use client";

import { LaptopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch } from "react-redux";
import {
  selectTheme,
  updateLocalCache,
  updateUserCache,
} from "@/lib/redux/slices/cacheSlice";
import { AppDispatch } from "@/lib/redux/store";
import { useEffect } from "react";
import { useCurrentTheme } from "@/hooks/use-current-role";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const currentTheme = useCurrentTheme();
  useEffect(() => {
    if (theme) {
      setTheme(currentTheme ?? "light");
    }
  }, [currentTheme, dispatch]);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    dispatch(updateLocalCache({ theme: newTheme }));
    dispatch(
      updateUserCache({
        theme: newTheme,
      })
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="size-10 focus-visible:ring-0">
          <SunIcon
            strokeWidth={1.5}
            className="!size-4 text-foreground/80 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          />
          <MoonIcon
            strokeWidth={1.5}
            className="!size-4 text-foreground/80 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
          <SunIcon className="mr-2 size-4" />
          <span>Sáng</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
          <MoonIcon className="mr-2 size-4" />
          <span>Tối</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("system")}>
          <LaptopIcon className="mr-2 size-4" />
          <span>Hệ thống</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
