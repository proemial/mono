"use client";

import { cn } from "@/app/components/shadcn-ui/utils";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useEffect } from "react";

export function LoadingState() {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          display: "inline-block",
          opacity: 1,
        },
        {
          duration: 0.3,
          delay: stagger(0.1),
          ease: "easeInOut",
        }
      );
    }
  }, [isInView]);

  return (
    <motion.span
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.8,

        repeat: Infinity,
        repeatType: "reverse",
      }}
      className={cn(
        "inline-block rounded-sm w-[4px]  h-4 sm:h-6 xl:h-12 bg-green-500"
      )}
    ></motion.span>
  );
}
