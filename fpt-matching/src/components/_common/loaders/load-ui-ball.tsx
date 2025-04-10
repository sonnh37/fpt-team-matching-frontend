"use client";
import { DotPulse } from "ldrs/react";
import "ldrs/react/DotPulse.css";
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
      <DotPulse size="80" speed="0.7" color={color} />
    </>
  );
};

export default LoadUIBall;
