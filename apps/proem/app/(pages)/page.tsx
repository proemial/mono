// import dynamic from "next/dynamic";
import logo from "@/app/images/logo.png";
import { Anek_Malayalam } from "next/font/google";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { useAuthActions } from "../components/authentication";
// import { Button } from "../components/shadcn-ui/button";
// import { queryClient } from "../state/react-query";
// import { PaperFeed } from "./feed";

const font = Anek_Malayalam({ subsets: ["latin"], display: "swap" });

export default function HomePage() {
  return (
    // <QueryClientProvider client={queryClient}>
    <main
      className={`${font.className} min-h-[calc(100dvh-48px)] flex flex-col justify-begin`}
    >
      <div
        className={`h-[calc(100dvh-48px)] max-h-screen flex flex-col justify-center items-center bg-zinc-900`}
      >
        <div className="h-[10%]"></div>
        <div className="h-[50%] w-full flex flex-col justify-center items-center">
          <img src={logo.src} style={{ maxHeight: "40%" }} alt="" />
          <div className="text-3xl md:text-7xl">Paperflow</div>
        </div>
        <div className="h-[40%] w-full flex justify-center items-center">
          {/*<LoggedinGreeting />*/}
          {/*<LoggedoutNudge />*/}
        </div>
      </div>
      {/*<PaperFeed />*/}
    </main>
    // </QueryClientProvider>
  );
}

// const LoggedinGreeting = dynamic(
//     () =>
//         Promise.resolve(() => {
//             const { user, status } = useAuthActions();
//
//             if (!user && status !== "member") return undefined;
//
//             return (
//                 <div className="text-secondary text-xl font-normal px-8 mt-4 text-center">
//                     Swipe up to get started
//                 </div>
//             );
//         }),
//     { ssr: false }
// );
//
// const LoggedoutNudge = dynamic(
//     () =>
//         Promise.resolve(() => {
//             const { user, status } = useAuthActions();
//
//             if (user) return undefined;
//
//             switch (status) {
//                 case "member":
//                     return undefined;
//                 case "waitlist":
//                     return (
//                         <div>
//                             <div className="text-lg text-center">
//                                 Thank you for your interest!
//                             </div>
//                             <div className="text-center text-sm">
//                                 You are on our waitlist.
//                             </div>
//                         </div>
//                     );
//                 default:
//                     return (
//                         <Button
//                             variant="secondary"
//                             onClick={() => (window.location.href = `/waitlist`)}
//                         >
//                             Join our waitlist
//                         </Button>
//                     );
//             }
//         }),
//     {
//         ssr: false,
//     }
// );
