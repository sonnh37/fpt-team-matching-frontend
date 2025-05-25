"use client";
import { Bouncy, DotPulse, Ring } from "ldrs/react";
import "ldrs/react/Ring.css";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const LoadUIBall = () => {
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
      <Ring size={35} bgOpacity={0.05} stroke={2} color={color} />
    </>
  );
};

export default LoadUIBall;
