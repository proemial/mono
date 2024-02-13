"use client";
// https://letsbuildui.dev/articles/building-a-drawer-component-with-react-portals

import { cn } from "@/app/components/shadcn-ui/utils";
import useMountTransition from "@/app/components/use-mount-transition";
import "@/app/drawer.css";
import { MutableRefObject, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function createPortalRoot() {
  const drawerRoot = document.createElement("div");
  drawerRoot.setAttribute("id", "drawer-root");

  return drawerRoot;
}

type Props = {
  isOpen: boolean;
  children: any;
  className?: string;
  onClose: () => void;
  position?: "left" | "right" | "top" | "bottom";
  removeWhenClosed?: boolean;
};

function Drawer({
  isOpen,
  children,
  className,
  onClose,
  position = "right",
  removeWhenClosed = true,
}: Props) {
  const bodyRef = useRef(
    document.querySelector("body")
  ) as MutableRefObject<HTMLBodyElement>;
  const portalRootRef = useRef(
    document.getElementById("drawer-root") || createPortalRoot()
  );

  // Append portal root on mount
  useEffect(() => {
    bodyRef.current.appendChild(portalRootRef.current);
    const portal = portalRootRef.current;
    const bodyEl = bodyRef.current;

    return () => {
      // Clean up the portal when drawer component unmounts
      portal.remove();
      // Ensure scroll overflow is removed
      bodyEl.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const updatePageScroll = () => {
      if (isOpen) {
        bodyRef.current.style.overflow = "hidden";
      } else {
        bodyRef.current.style.overflow = "";
      }
    };

    updatePageScroll();
  }, [isOpen]);

  useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keyup", onKeyPress);
    }

    return () => {
      window.removeEventListener("keyup", onKeyPress);
    };
  }, [isOpen, onClose]);

  const isTransitioning = useMountTransition(isOpen, 300);

  if (!isTransitioning && removeWhenClosed && !isOpen) {
    return null;
  }

  return createPortal(
    <div
      aria-hidden={isOpen ? "false" : "true"}
      className={cn("drawer-container h-full w-full", {
        open: isOpen,
        in: isTransitioning,
        className,
      })}
    >
      <div
        className={`backdrop h-full justify-end flex flex-col drawer ${position} items-center`}
        role="dialog"
        onClick={onClose}
      >
        <div className="w-full p-4 bg-[#333333] rounded-t-[32px] max-w-md">
          {children}
        </div>
      </div>
    </div>,
    portalRootRef.current
  );
}

export default Drawer;
