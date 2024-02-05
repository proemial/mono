export function PaperSource({ children }: { children?: string }) {
  return (
    <>
      {children && (
        <div>
          <div>Source</div>
          <div className="text-white/50">{children}</div>
        </div>
      )}
    </>
  );
}
