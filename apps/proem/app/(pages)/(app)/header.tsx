import { ReactNode } from "react";
import { PageHeader } from "@/app/components/page-header";

type Props = {
  title: string;
  children: ReactNode;
};

export default function WithHeader({ title, children }: Props) {
  return (
    <>
      <PageHeader title={title} />
      <div className="w-full h-full max-w-screen-md mx-auto py-14">
        {children}
      </div>
    </>
  );
}
