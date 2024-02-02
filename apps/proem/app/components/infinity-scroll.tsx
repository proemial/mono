type InfinityScrollProps = {
  children: React.ReactNode[];
  isDuplication?: boolean;
};

function InfinityScrollContainer({
  children,
  isDuplication = false,
}: InfinityScrollProps) {
  return (
    <div
      className="flex items-center justify-center focus:[animation-play-state:paused] gap-2 hover:[animation-play-state:paused] md:justify-start animate-infinite-scroll"
      aria-hidden={isDuplication ? "true" : "false"}
    >
      {children}
    </div>
  );
}

export function InfinityScroll({ children }: InfinityScrollProps) {
  return (
    <div className="flex w-full gap-2 truncate">
      <InfinityScrollContainer>{children}</InfinityScrollContainer>
      {/* todo: add aria-hidden="true" */}
      <InfinityScrollContainer isDuplication>
        {children}
      </InfinityScrollContainer>
    </div>
  );
}
