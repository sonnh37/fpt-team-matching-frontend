"use client";
import { motion } from "framer-motion";
import LoadUIBall from "./loaders/load-ui-ball";
import { LoadUIBall2 } from "./loaders/load-ui-ball-2";

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div role="status" className="flex items-center justify-center gap-2">
          <LoadUIBall />
        </div>
      </div>
    </div>
  );
}

export function LoadingComponent() {
  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <div role="status" className="flex items-center justify-center gap-2">
          <LoadUIBall2 />
        </div>
    </div>
  );
}
