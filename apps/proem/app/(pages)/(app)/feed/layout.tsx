import { ReactNode } from "react";
import WithHeader from "@/app/(pages)/(app)/header";
import { TabNavigation } from "@/app/components/proem-ui/tab-navigation/tabs";
import { OaTopics } from "@proemial/models/open-alex-topics";

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
            ...OaTopics.map((concept) => concept.display_name.toLowerCase()),
          ]}
          rootPath="/feed"
        />
      </div>
      {children}
    </WithHeader>
  );
}
