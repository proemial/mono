import { motion } from "framer-motion";

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
			<div className="h-[calc(100vh-200px)] flex items-center justify-center">
				<div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
					<p className="flex flex-row justify-center gap-4 items-center text-3xl">
						proem chat
					</p>
					<p>trustworthy answers backed by research</p>
				</div>
			</div>
		</motion.div>
	);
};
