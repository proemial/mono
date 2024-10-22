import { cn } from "@proemial/shadcn-ui";
import { screenMaxWidth } from "../constants";
import Terms from "./terms";

export default function TermsPage() {
	return <Terms className={cn("py-20 mx-auto", screenMaxWidth)} />;
}
