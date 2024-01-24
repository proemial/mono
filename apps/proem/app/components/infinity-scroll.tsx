type InfinityScrollProps = {
  children: React.ReactNode;
  isDuplication?: boolean;
};

function InfinityScrollContainer({
  children,
  isDuplication = false,
}: InfinityScrollProps) {
  return (
    <div
      className="flex items-center justify-center gap-2 group-hover:[animation-play-state:paused] md:justify-start animate-infinite-scroll"
      aria-hidden={isDuplication ? "true" : "false"}
    >
      {children}
    </div>
  );
}

export function InfinityScroll({ children }: InfinityScrollProps) {
  return (
    <div className="flex w-full gap-2 group">
      <InfinityScrollContainer>{children}</InfinityScrollContainer>
      {/* todo: add aria-hidden="true" */}
      <InfinityScrollContainer isDuplication>
        {children}
      </InfinityScrollContainer>
    </div>
  );
}
