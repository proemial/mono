"use client";

import { Tracker } from "@/app//components/analytics/tracker";
import { ReactNode, useState } from "react";

type Props = {
  title: "metadata" | "question";
  children: ReactNode | string;
  closed?: boolean;
  className?: string;
};

const titles = {
  metadata: "Article Metadata",
  question: "Ask a question",
};

export function Panel({ title, children, closed, className }: Props) {
  const [isClosed, setClosed] = useState(!!closed);

  const handleClick = () => {
    const prefix = isClosed ? "show" : "hide";
    Tracker.track(`click:panel-${prefix}-${title}`);
    setClosed(!isClosed);
  };

  return (
    <div>
      <div
        className={`${className} flex justify-between`}
        onClick={handleClick}
      >
        <div className={`text-xl`}>{titles[title]}</div>
        <ToggleButton closed={isClosed} />
      </div>
      <div className={`${isClosed ? "hidden" : ""}`}>{children}</div>
    </div>
  );
}

function ToggleButton({ closed }: { closed: boolean }) {
  return (
    <button type="button" className="text-sm text-primary">
      {closed ? "Show" : "Hide"}
    </button>
  );
}
