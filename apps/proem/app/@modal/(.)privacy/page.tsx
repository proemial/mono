"use client"
import {
    Button,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@proemial/shadcn-ui";
import { XClose } from "@untitled-ui/icons-react";
import { useRouter } from "next/navigation";
import Privacy from "@/app/privacy/privacy";
import { screenMaxWidth } from "@/app/constants";

export default function TermsModal() {
    const router = useRouter();

    return (
        <Drawer open>
            <DrawerContent className={`${screenMaxWidth} w-full h-full mx-auto rounded-none`}>
                <div className="flex flex-col max-h-full gap-6">
                    <DrawerHeader className="pt-0 grow-0">
                        <DrawerTitle className="flex justify-between text-2xl font-normal">
                            <div>Privacy policy</div>
                            <Button variant="ghost" className="p-0" onClick={() => router.back()}>
                                <XClose className="w-6 h-6" />
                            </Button>
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="grow px-8 overflow-auto">
                        <Privacy />
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
