import { IconWrapper } from "@/app/(pages)/(app)/oa/[id]/components/icons/wrapper";
import { SourceIcon } from "@/app/(pages)/(app)/oa/[id]/components/icons/source-icon";

export function PaperSource({ children }: { children?: string }) {
  return (
    <>
      {children && (
        <div>
          <IconWrapper>
            <SourceIcon />
            Source
          </IconWrapper>
          <div className="text-white/50 truncate">{children}</div>
        </div>
      )}
    </>
  );
}
