import { motion } from "framer-motion";
import "./css/load-circle.css";

const LoadCircle = () => {
  return (
    <motion.span
      className="loader"
      initial={{ opacity: 0 }}  
      animate={{ opacity: 1 }}  
      exit={{ opacity: 0 }}    
      transition={{ duration: 0.5 }} 
    />
  );
};

export default LoadCircle;