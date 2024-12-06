import { motion } from "framer-motion";
import { ProemIcon } from "@/components/custom/icons";

export const Welcome = () => {
	return (
		<motion.div
			key="overview"
			className="max-w-3xl mx-auto"
			initial={{ opacity: 0, scale: 0.98 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.98 }}
			transition={{ delay: 0.5 }}
		>
			<div className="h-[calc(100vh-400px)] flex items-center justify-center">
				<div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center text-2xl">
					<div className="flex justify-center"><ProemIcon size={48} /></div>
					<p>answers you can trust</p>
				</div>
			</div>
		</motion.div>
	);
};
