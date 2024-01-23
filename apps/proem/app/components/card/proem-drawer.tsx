"use client";

import Drawer from "@/app/components/drawer/drawer";
import { useDrawerState } from "@/app/components/card/state";
import { Button } from "@/app/components/shadcn-ui/button";
import { usePathname, useSearchParams } from "next/navigation";

export function ProemDrawer() {
    const { isOpen, close, open } = useDrawerState();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    return (
        <>
            <div
                onClick={open}
                className="bg-[url('https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?q=80&w=1768&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-left-top flex flex-col mx-4 mt-3 p-6 h-48 cursor-pointer bg-[#322040] rounded-sm justify-between">
                <div className="flex flex-col font-sans font-normal text-white gap-1">
                    <p className="text-xl leading-tight font-sans font-medium">Learn more about <span className="text-[#7DFA86]">proemial</span> and understand our mission.</p>
                </div>
                <div>
                    <Button
                        variant="ae_starter"
                        size="wide"
                        className="bg-white text-black rounded-full"
                    >
                        Learn more
                    </Button>
                </div>
            </div>

            <Drawer isOpen={isOpen} onClose={close} removeWhenClosed={false}>
                <div className="flex flex-col gap-2">
                    <div className="bg-[url('https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?q=80&w=1768&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-left-top h-52 rounded-sm" />
                    <div className="font-sans">
                        <p className="text-xl leading-tight font-sans font-medium mb-2 mt-1">We're on a mission to make research easy to understand.</p>
                        <p className="text-sm font-sans font-medium text-[#E9E9E7]">With an innovative use of cutting edge AI, conversation design, and a deep understanding of science dissemination, proemial is creating a product that will help us dig through the mountains of publications</p>
                    </div>
                </div>
            </Drawer>
        </>
    );
}
