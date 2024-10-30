import { NewsItem } from "@proemial/adapters/redis/news";
import React from "react";
import { ActionBar } from "./components/actionbar";

export function NewsCard({ data }: { data: NewsItem }) {
	const background = data._?.background ?? "#000000";

	return (
		<div className="flex flex-col items-start gap-1 relative">
			<div
				className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] rounded-[20px] overflow-hidden shadow-[0px_2px_8px_2px_#00000033] text-white"
				style={{ background }}
			>
				<img
					className="relative self-stretch w-full h-[200px] object-cover"
					alt=""
					src={data?.source?.image}
				/>

				<div className="flex flex-col items-center justify-center gap-2 p-3 relative self-stretch w-full flex-[0_0_auto] ">
					<p className="relative self-stretch mt-[-1.00px] [font-family:'Lato-SemiBold',Helvetica] font-semibold text-xl tracking-[0] leading-[normal]">
						{data.generated?.title}
					</p>
				</div>

				<ActionBar />

				<QA />
			</div>
		</div>
	);
}

function QA() {
	return <div className="my-2" />;
	// return (
	//     <div className="flex flex-col items-start gap-2 pt-2 pb-3 px-0 relative self-stretch w-full flex-[0_0_auto]">
	//     <div className="flex items-start gap-1.5 px-3 py-0 relative self-stretch w-full flex-[0_0_auto]">
	//       <div className="flex w-10 h-10 items-center gap-1 relative">
	//         <img
	//           className="relative w-10 h-10 object-cover"
	//           alt=""
	//           src={image2}
	//         />
	//       </div>

	//       <div className="flex flex-col items-start gap-1 relative flex-1 grow">
	//         <div className="flex flex-col items-center justify-center gap-1 px-3 py-2 relative self-stretch w-full flex-[0_0_auto] bg-[#e9eaee] rounded-xl">
	//           <div className="flex items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
	//             <div className="relative flex-1 mt-[-1.00px] [font-family:'Lato-Bold',Helvetica] font-bold text-[#08080a] text-sm tracking-[0] leading-[14px]">
	//               Mads Rydahl
	//             </div>
	//           </div>

	//           <p className="relative self-stretch [font-family:'Lato-Medium',Helvetica] font-medium text-[#08080a] text-[15px] tracking-[0] leading-5">
	//             What are the requirements for maintaining J-1 visa status
	//             while working?
	//           </p>
	//         </div>
	//       </div>

	//       <img
	//         className="absolute w-0.5 h-[60px] top-[269px] left-[-29391px]"
	//         alt="Rectangle"
	//         src={rectangle1084}
	//       />
	//     </div>

	//     <div className="flex flex-col items-start gap-2 pl-[58px] pr-3 py-0 relative self-stretch w-full flex-[0_0_auto]">
	//       <div className="flex items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
	//         <img
	//           className="relative flex-[0_0_auto]"
	//           alt="Frame"
	//           src={frame15038}
	//         />

	//         <div className="flex flex-col items-start gap-1 relative flex-1 grow">
	//           <div className="flex flex-col items-center justify-center gap-1 p-3 relative self-stretch w-full flex-[0_0_auto] bg-[#e9eaee] rounded-xl">
	//             <div className="flex items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
	//               <div className="relative w-fit mt-[-1.00px] [font-family:'Lato-Bold',Helvetica] font-bold text-[#08080a] text-sm tracking-[0] leading-[14px] whitespace-nowrap">
	//                 proem.ai
	//               </div>

	//               <div className="inline-flex items-center justify-center gap-2 px-1 py-0 relative flex-[0_0_auto] bg-[#ebf5ff] rounded-xl">
	//                 <div className="relative w-fit mt-[-1.00px] [font-family:'Lato-Medium',Helvetica] font-medium text-[#0164d0] text-[11px] tracking-[0] leading-[14px] whitespace-nowrap">
	//                   Research bot
	//                 </div>
	//               </div>
	//             </div>

	//             <p className="relative self-stretch [font-family:'Lato-Medium',Helvetica] font-medium text-[#08080a] text-[15px] tracking-[0] leading-5 overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
	//               J-1 visa holders must be enrolled in a full-time course of
	//               study and secure authorization for work aligned with
	//               academic training. Unauthorized employment can invalidate
	//               visa status (Amuedo-Dorantes &amp; Antman, 2022).
	//             </p>
	//           </div>
	//         </div>
	//       </div>
	//     </div>
	//   </div>
	// )
}
