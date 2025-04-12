"use client";
import { Zoomies } from "ldrs/react";
import "ldrs/react/Zoomies.css";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Default values shown

export const LoadUIBall2 = () => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  const color = theme === "dark" ? "#ffffff" : "#000000";

  return (
    <>
      <Zoomies size="100" stroke="5" bgOpacity="0.1" speed="0.7" color={color} />
    </>
  );
};
