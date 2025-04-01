"use client";

import { motion } from "framer-motion";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from "react-icons/fi";

interface AlertMessageProps {
  message: string;
  messageType?: "error" | "warning" | "success" | "info";
  className?: string;
  withIcon?: boolean;
  animationType?: "fade" | "slide" | "bounce";
}

export const AlertMessage = ({
  message,
  messageType = "error",
  className = "",
  withIcon = true,
  animationType = "fade",
}: AlertMessageProps) => {
  // Map message type to Tailwind colors
  const colorClasses = {
    error: "text-red-500",
    warning: "text-yellow-500",
    success: "text-green-500",
    info: "text-blue-500",
  };

  // Icons for each message type
  const icons = {
    error: <FiAlertCircle className="mr-2" size={24} />,
    warning: <FiAlertTriangle className="mr-2" size={24} />,
    success: <FiCheckCircle className="mr-2" size={24} />,
    info: <FiInfo className="mr-2" size={24} />,
  };

  // Animation variants
  const animationVariants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
    bounce: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { 
        opacity: 1, 
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 10 }
      },
      exit: { opacity: 0, scale: 0.8 },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={animationVariants[animationType]}
      className="absolute inset-0 flex justify-center items-center"
    >
      <div className={`flex flex-col gap-4 ${className}`}>
        <motion.div 
          className={`text-3xl ${colorClasses[messageType]} pb-4 text-center flex items-center justify-center`}
          // whileHover={{ scale: 1.02 }}
          // whileTap={{ scale: 0.98 }}
        >
          {withIcon && icons[messageType]}
          {message}
        </motion.div>
      </div>
    </motion.div>
  );
};