"use client";

import { useState } from "react";

export function ErrorModal({ error }: { error: string }) {
	const [modalOpen, setModalOpen] = useState(true);
	return (
		<>
			{modalOpen && (
				<div
					className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
					onClick={() => setModalOpen(false)}
				>
					<div
						className="bg-white p-6 rounded-lg shadow-lg"
						onClick={(e) => e.stopPropagation()}
					>
						{error}
					</div>
				</div>
			)}
		</>
	);
}
