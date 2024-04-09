import { FileSearch2 } from "lucide-react";
import { Header5 } from "@/components/ui/typography";
import { Icons } from "@/components/ui/icons";

export function ChatPapersSkeleton({ statusText }: { statusText: string }) {
    return (
        <div className="flex items-center place-content-between">
            <div>
                <FileSearch2 className="size-5" />
            </div>
            <div className="flex gap-2 items-center">
                <Header5>{statusText}</Header5>
                <Icons.throbber />
            </div>
        </div>
    );
}

export function ChatAnswerSkeleton() {
    return (
        <div className="flex items-center place-content-between">
            <div>
                <FileSearch2 className="size-5" />
            </div>
            <div className="flex gap-2 items-center">
                <Header5>Retrieving answer</Header5>
                <Icons.throbber />
            </div>
        </div>
    );
}