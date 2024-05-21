"use client";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Header4 } from "@/components/ui/typography";
import { ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";

export function ProfileBookmarks() {
	const [isOpen, setIsOpen] = React.useState(true);

	const count = 2;

	const bookmarks = [
		"Unveiling the Mysteries of Dark Matter through Galactic Rotation Curves",
		"The Role of CRISPR-Cas9 in Revolutionizing Gene Editing: Potential and Ethics",
		"Quantum Computing: Navigating the Next Frontier in Computational Speed",
		"Climate Change and Coral Reefs: Assessing the Impacts and Strategies for Resilience",
		"Artificial Intelligence in Healthcare: Enhancing Diagnostic Precision",
		"Exploring the Possibility of Life: A Study of Exoplanetary Atmospheres",
		"The Future of Renewable Energy: Advances in Solar Cell Efficiency",
		"Deciphering the Language of Neurons: Insights into Brain-Computer Interfaces",
		"Plastic Eaters: Engineering Bacteria to Combat Pollution",
		"Beyond the Higgs: Searching for New Particles in the Post-LHC Era",
		"The Human Microbiome: Unraveling Its Impact on Health and Disease",
		"Graphene Superconductors: Unlocking New Potentials in Electronics",
		"The Psychology of Virtual Reality: Immersion and its Effects on the Mind",
		"Mapping the Universe: The Latest in Cosmic Microwave Background Radiation",
		"Artificial Photosynthesis: A Sustainable Approach to Renewable Fuels",
		"Deep Learning and Climate Change: Predicting Weather Patterns with AI",
		"The Race to Mars: Challenges and Strategies for Sustaining Human Life",
		"Nanorobots in Medicine: The Next Revolution in Targeted Drug Delivery",
		"Ocean Acidification: The Silent Threat to Marine Biodiversity",
		"The Evolution of Social Behavior in Apes: Insights into Human Societies",
		"Stem Cells and Regenerative Medicine: The Path to Healing the Body",
		"The Anthropocene Epoch: Defining Humanity’s Impact on the Earth",
		"Virtual Particles and the Vacuum: Unraveling the Fabric of Space-Time",
		"The Mechanics of Bird Flight: Aerodynamics and Evolutionary Adaptations",
		"Harnessing the Power of Fusion: The Quest for Clean, Unlimited Energy",
		"Astrobiology and the Search for Extraterrestrial Microbial Life",
	];

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<CollapsibleTrigger className="w-full">
				<div className="flex items-center place-content-between">
					<div className="flex gap-4 items-center">
						<Header4>Bookmarks</Header4>
					</div>
					<div className="flex items-center gap-2">
						<p>{bookmarks.length}</p>
						{isOpen ? (
							<ChevronUp className="h-4 w-4" />
						) : (
							<ChevronDown className="h-4 w-4" />
						)}
					</div>
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent className="pt-2">
				<Table className="text-base">
					<TableBody>
						{bookmarks.map((bookmark, index) => (
							<TableRow key={index}>
								<TableCell variant="text">
									<p className="line-clamp-1">{bookmark}</p>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CollapsibleContent>
		</Collapsible>
	);
}
