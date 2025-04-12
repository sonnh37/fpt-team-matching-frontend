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
    <div className="flex justify-center items-center p-4">
      <div className="w-16 h-auto">
        <LoadUIBall2 />
      </div>
    </div>
  );
}
