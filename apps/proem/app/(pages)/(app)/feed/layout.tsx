import { ReactNode } from "react";
import WithHeader from "@/app/(pages)/(app)/header";
import { TabNavigation } from "@/app/components/proem-ui/tab-navigation";
import { OaConcepts } from "@proemial/models/open-alex-concepts";

const pageName = "feed";

export const metadata = {
  title: `proem - ${pageName}`,
};

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  return (
    <WithHeader title={pageName}>
      <div className="mb-4 flex justify-center">
        <TabNavigation
          items={[
            "all",
            ...OaConcepts.map((concept) => concept.display_name.toLowerCase()),
          ]}
          rootPath="/feed"
        />
      </div>
      {children}
    </WithHeader>
  );
}
