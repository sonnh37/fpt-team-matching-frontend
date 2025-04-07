"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const LoadCircle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Hoặc return một placeholder loading nếu cần
  }

  const color = theme === "dark" ? "#ffffff" : "#000000";

  return (
     // <motion.span
    //   className="loader"
    //   initial={{ opacity: 0 }}
    //   animate={{ opacity: 1 }}
    //   exit={{ opacity: 0 }}
    //   transition={{ duration: 0.5 }}
    // />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Ring size="50" stroke="3.5" bgOpacity="0.04" speed="1.4" color={color} />
    </motion.div>
  );
};

export default LoadCircle;