"use client"
import {
    Button,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@proemial/shadcn-ui";
import Terms from "../../terms/terms";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsModal() {
    const router = useRouter();

    return (
        <Drawer open>
            <DrawerContent className="w-full h-full max-w-screen-md mx-auto">
                <div className="flex flex-col">
                    <DrawerHeader>
                        <DrawerTitle className="flex justify-between pt-12 text-2xl font-normal">
                            <div>Proemial Terms of Service</div>
                            <Button variant="ghost" className="p-0" onClick={() => router.back()}>
                                <X className="w-6 h-6" />
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
