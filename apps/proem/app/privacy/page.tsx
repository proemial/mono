import { cn } from "@proemial/shadcn-ui";
import Privacy from "./privacy";
import { screenMaxWidth } from "../constants";

export default function PrivacyPage() {
	return <Privacy className={cn("py-20 mx-auto", screenMaxWidth)} />;
}
