"use client"
import {
    Button,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@proemial/shadcn-ui";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import Privacy from "@/app/privacy/privacy";

export default function TermsModal() {
    const router = useRouter();

    return (
        <Drawer open>
            <DrawerContent className="w-full h-full max-w-screen-md mx-auto">
                <div className="flex flex-col max-h-full gap-6">
                    <DrawerHeader className="grow-0">
                        <DrawerTitle className="flex justify-between pt-12 text-2xl font-normal">
                            <div>Privacy policy</div>
                            <Button variant="ghost" className="p-0" onClick={() => router.back()}>
                                <X className="w-6 h-6" />
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
