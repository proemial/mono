"use client"
import {
    Button,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@proemial/shadcn-ui";
import Terms from "../../terms/terms";
import { XClose } from "@untitled-ui/icons-react";
import { useRouter } from "next/navigation";
import { screenMaxWidth } from "@/app/constants";

export default function TermsModal() {
    const router = useRouter();

    return (
        <Drawer open>
            <DrawerContent className={`${screenMaxWidth} w-full h-full mx-auto rounded-none`}>
                <div className="flex flex-col">
                    <DrawerHeader className="pt-0">
                        <DrawerTitle className="flex justify-between text-2xl font-normal">
                            <div>Proemial Terms of Service</div>
                            <Button variant="ghost" className="p-0" onClick={() => router.back()}>
                                <XClose className="w-6 h-6" />
                            </Button>
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="px-8">
                        <Terms />
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
