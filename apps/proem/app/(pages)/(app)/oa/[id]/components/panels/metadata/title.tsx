export function Title({ children }: { children?: string }) {
  return (
    <>
      {children && (
        <div>
          <div>Title</div>
          <div className="text-white/50">{children}</div>
        </div>
      )}
    </>
  );
}
