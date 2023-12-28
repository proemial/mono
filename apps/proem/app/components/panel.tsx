"use client";

import { ReactNode, useState } from "react";
import { Analytics } from "./analytics";

type Props = {
  title: "metadata";
  children: ReactNode | string;
  closed?: boolean;
  className?: string;
};

const titles = {
  metadata: "Article Metadata",
};

export function Panel({ title, children, closed, className }: Props) {
  const [isClosed, setClosed] = useState(!!closed);

  const handleClick = () => {
    const prefix = isClosed ? "show" : "hide";
    Analytics.track(`click:panel-${prefix}-${title}`);
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
