import { ArXivCategory } from "../models/arxiv-atom";

export function arXivCategory(key: string): ArXivCategory {
	return (
		arxivCategories.find((entry) => entry.key === key) || {
			key,
			title: "",
			category: "",
		}
	);
}

export const arxivCategories = [
	{ key: "cs", title: "Computer Science", category: "Computer Science" },
	{
		key: "cs.AI",
		title: "Artificial Intelligence",
		category: "Computer Science",
	},
	{
		key: "cs.CL",
		title: "Computation and Language",
		category: "Computer Science",
	},
	{
		key: "cs.CC",
		title: "Computational Complexity",
		category: "Computer Science",
	},
	{
		key: "cs.CE",
		title: "Computational Engineering, Finance, and Science",
		category: "Computer Science",
	},
	{
		key: "cs.CG",
		title: "Computational Geometry",
		category: "Computer Science",
	},
	{
		key: "cs.GT",
		title: "Computer Science and Game Theory",
		category: "Computer Science",
	},
	{
		key: "cs.CV",
		title: "Computer Vision and Pattern Recognition",
		category: "Computer Science",
	},
	{
		key: "cs.CY",
		title: "Computers and Society",
		category: "Computer Science",
	},
	{
		key: "cs.CR",
		title: "Cryptography and Security",
		category: "Computer Science",
	},
	{
		key: "cs.DS",
		title: "Data Structures and Algorithms",
		category: "Computer Science",
	},
	{ key: "cs.DB", title: "Databases", category: "Computer Science" },
	{ key: "cs.DL", title: "Digital Libraries", category: "Computer Science" },
	{ key: "cs.DM", title: "Discrete Mathematics", category: "Computer Science" },
	{
		key: "cs.DC",
		title: "Distributed, Parallel, and Cluster Computing",
		category: "Computer Science",
	},
	{
		key: "cs.ET",
		title: "Emerging Technologies",
		category: "Computer Science",
	},
	{
		key: "cs.FL",
		title: "Formal Languages and Automata Theory",
		category: "Computer Science",
	},
	{ key: "cs.GL", title: "General Literature", category: "Computer Science" },
	{ key: "cs.GR", title: "Graphics", category: "Computer Science" },
	{
		key: "cs.AR",
		title: "Hardware Architecture",
		category: "Computer Science",
	},
	{
		key: "cs.HC",
		title: "Human-Computer Interaction",
		category: "Computer Science",
	},
	{
		key: "cs.IR",
		title: "Information Retrieval",
		category: "Computer Science",
	},
	{ key: "cs.IT", title: "Information Theory", category: "Computer Science" },
	{
		key: "cs.LO",
		title: "Logic in Computer Science",
		category: "Computer Science",
	},
	{ key: "cs.LG", title: "Machine Learning", category: "Computer Science" },
	{
		key: "cs.MS",
		title: "Mathematical Software",
		category: "Computer Science",
	},
	{ key: "cs.MA", title: "Multiagent Systems", category: "Computer Science" },
	{ key: "cs.MM", title: "Multimedia", category: "Computer Science" },
	{
		key: "cs.NI",
		title: "Networking and Internet Architecture",
		category: "Computer Science",
	},
	{
		key: "cs.NE",
		title: "Neural and Evolutionary Computing",
		category: "Computer Science",
	},
	{ key: "cs.NA", title: "Numerical Analysis", category: "Computer Science" },
	{ key: "cs.OS", title: "Operating Systems", category: "Computer Science" },
	{
		key: "cs.OH",
		title: "Other Computer Science",
		category: "Computer Science",
	},
	{ key: "cs.PF", title: "Performance", category: "Computer Science" },
	{
		key: "cs.PL",
		title: "Programming Languages",
		category: "Computer Science",
	},
	{ key: "cs.RO", title: "Robotics", category: "Computer Science" },
	{
		key: "cs.SI",
		title: "Social and Information Networks",
		category: "Computer Science",
	},
	{ key: "cs.SE", title: "Software Engineering", category: "Computer Science" },
	{ key: "cs.SD", title: "Sound", category: "Computer Science" },
	{ key: "cs.SC", title: "Symbolic Computation", category: "Computer Science" },
	{ key: "cs.SY", title: "Systems and Control", category: "Computer Science" },

	{ key: "econ", title: "Economics", category: "Economics" },
	{ key: "econ.EM", title: "Econometrics", category: "Economics" },
	{ key: "econ.GN", title: "General Economics", category: "Economics" },
	{ key: "econ.TH", title: "Theoretical Economics", category: "Economics" },

	{
		key: "eess",
		title: "Electrical Engineering and Systems Science",
		category: "Electrical Engineering and Systems Science",
	},
	{
		key: "eess.AS",
		title: "Audio and Speech Processing",
		category: "Electrical Engineering and Systems Science",
	},
	{
		key: "eess.IV",
		title: "Image and Video Processing",
		category: "Electrical Engineering and Systems Science",
	},
	{
		key: "eess.SP",
		title: "Signal Processing",
		category: "Electrical Engineering and Systems Science",
	},
	{
		key: "eess.SY",
		title: "Systems and Control",
		category: "Electrical Engineering and Systems Science",
	},

	{ key: "math", title: "Mathematics", category: "Mathematics" },
	{ key: "math.AG", title: "Algebraic Geometry", category: "Mathematics" },
	{ key: "math.AT", title: "Algebraic Topology", category: "Mathematics" },
	{ key: "math.AP", title: "Analysis of PDEs", category: "Mathematics" },
	{ key: "math.CT", title: "Category Theory", category: "Mathematics" },
	{
		key: "math.CA",
		title: "Classical Analysis and ODEs",
		category: "Mathematics",
	},
	{ key: "math.CO", title: "Combinatorics", category: "Mathematics" },
	{ key: "math.AC", title: "Commutative Algebra", category: "Mathematics" },
	{ key: "math.CV", title: "Complex Variables", category: "Mathematics" },
	{ key: "math.DG", title: "Differential Geometry", category: "Mathematics" },
	{ key: "math.DS", title: "Dynamical Systems", category: "Mathematics" },
	{ key: "math.FA", title: "Functional Analysis", category: "Mathematics" },
	{ key: "math.GM", title: "General Mathematics", category: "Mathematics" },
	{ key: "math.GN", title: "General Topology", category: "Mathematics" },
	{ key: "math.GT", title: "Geometric Topology", category: "Mathematics" },
	{ key: "math.GR", title: "Group Theory", category: "Mathematics" },
	{ key: "math.HO", title: "History and Overview", category: "Mathematics" },
	{ key: "math.IT", title: "Information Theory", category: "Mathematics" },
	{ key: "math.KT", title: "K-Theory and Homology", category: "Mathematics" },
	{ key: "math.LO", title: "Logic", category: "Mathematics" },
	{ key: "math.MP", title: "Mathematical Physics", category: "Mathematics" },
	{ key: "math.MG", title: "Metric Geometry", category: "Mathematics" },
	{ key: "math.NT", title: "Number Theory", category: "Mathematics" },
	{ key: "math.NA", title: "Numerical Analysis", category: "Mathematics" },
	{ key: "math.OA", title: "Operator Algebras", category: "Mathematics" },
	{
		key: "math.OC",
		title: "Optimization and Control",
		category: "Mathematics",
	},
	{ key: "math.PR", title: "Probability", category: "Mathematics" },
	{ key: "math.QA", title: "Quantum Algebra", category: "Mathematics" },
	{ key: "math.RT", title: "Representation Theory", category: "Mathematics" },
	{ key: "math.RA", title: "Rings and Algebras", category: "Mathematics" },
	{ key: "math.SP", title: "Spectral Theory", category: "Mathematics" },
	{ key: "math.ST", title: "Statistics Theory", category: "Mathematics" },
	{ key: "math.SG", title: "Symplectic Geometry", category: "Mathematics" },

	{ key: "physics", title: "Physics", category: "Physics" },

	{ key: "astro-ph", title: "Astrophysics", category: "Physics/Astrophysics" },
	{
		key: "astro-ph.GA",
		title: "Astrophysics of Galaxies",
		category: "Physics/Astrophysics",
	},
	{
		key: "astro-ph.CO",
		title: "Cosmology and Nongalactic Astrophysics",
		category: "Physics/Astrophysics",
	},
	{
		key: "astro-ph.EP",
		title: "Earth and Planetary Astrophysics",
		category: "Physics/Astrophysics",
	},
	{
		key: "astro-ph.HE",
		title: "High Energy Astrophysical Phenomena",
		category: "Physics/Astrophysics",
	},
	{
		key: "astro-ph.IM",
		title: "Instrumentation and Methods for Astrophysics",
		category: "Physics/Astrophysics",
	},
	{
		key: "astro-ph.SR",
		title: "Solar and Stellar Astrophysics",
		category: "Physics/Astrophysics",
	},

	{
		key: "cond-mat.dis-nn",
		title: "Disordered Systems and Neural Networks",
		category: "Physics/Condensed Matter",
	},
	{
		key: "cond-mat.mtrl-sci",
		title: "Materials Science",
		category: "Physics/Condensed Matter",
	},
	{
		key: "cond-mat.mes-hall",
		title: "Mesoscale and Nanoscale Physics",
		category: "Physics/Condensed Matter",
	},
	{
		key: "cond-mat.other",
		title: "Other Condensed Matter",
		category: "Physics/Condensed Matter",
	},
	{
		key: "cond-mat.quant-gas",
		title: "Quantum Gases",
		category: "Physics/Condensed Matter",
	},
	{
		key: "cond-mat.soft",
		title: "Soft Condensed Matter",
		category: "Physics/Condensed Matter",
	},
	{
		key: "cond-mat.stat-mech",
		title: "Statistical Mechanics",
		category: "Physics/Condensed Matter",
	},
	{
		key: "cond-mat.str-el",
		title: "Strongly Correlated Electrons",
		category: "Physics/Condensed Matter",
	},
	{
		key: "cond-mat.supr-con",
		title: "Superconductivity",
		category: "Physics/Condensed Matter",
	},

	{
		key: "gr-qc",
		title: "General Relativity and Quantum Cosmology",
		category: "Physics/General Relativity and Quantum Cosmology",
	},

	{
		key: "hep-ex",
		title: "High Energy Physics - Experiment",
		category: "Physics/High Energy Physics",
	},
	{
		key: "hep-lat",
		title: "High Energy Physics - Lattice",
		category: "Physics/High Energy Physics",
	},
	{
		key: "hep-ph",
		title: "High Energy Physics - Phenomenology",
		category: "Physics/High Energy Physics",
	},
	{
		key: "hep-th",
		title: "High Energy Physics - Theory",
		category: "Physics/High Energy Physics",
	},

	{
		key: "math-ph",
		title: "Mathematical Physics",
		category: "Physics/Mathematical Physics",
	},

	{
		key: "nlin.AO",
		title: "Adaptation and Self-Organizing Systems",
		category: "Physics/Nonlinear Sciences",
	},
	{
		key: "nlin.CG",
		title: "Cellular Automata and Lattice Gases",
		category: "Physics/Nonlinear Sciences",
	},
	{
		key: "nlin.CD",
		title: "Chaotic Dynamics",
		category: "Physics/Nonlinear Sciences",
	},
	{
		key: "nlin.SI",
		title: "Exactly Solvable and Integrable Systems",
		category: "Physics/Nonlinear Sciences",
	},
	{
		key: "nlin.PS",
		title: "Pattern Formation and Solitons",
		category: "Physics/Nonlinear Sciences",
	},

	{
		key: "nucl-ex",
		title: "Nuclear Experiment",
		category: "Physics/Nuclear Physics",
	},
	{
		key: "nucl-th",
		title: "Nuclear Theory",
		category: "Physics/Nuclear Physics",
	},

	{ key: "nucl-th", title: "Nuclear Theory", category: "Physics" },
	{ key: "physics.space-ph", title: "Space Physics", category: "Physics" },
	{ key: "physics.quant-ph", title: "Quantum Physics", category: "Physics" },

	{ key: "physics.acc-ph", title: "Accelerator Physics", category: "Physics" },
	{ key: "physics.app-ph", title: "Applied Physics", category: "Physics" },
	{
		key: "physics.ao-ph",
		title: "Atmospheric and Oceanic Physics",
		category: "Physics",
	},
	{
		key: "physics.atm-clus",
		title: "Atomic and Molecular Clusters",
		category: "Physics",
	},
	{ key: "physics.atom-ph", title: "Atomic Physics", category: "Physics" },
	{ key: "physics.bio-ph", title: "Biological Physics", category: "Physics" },
	{ key: "physics.chem-ph", title: "Chemical Physics", category: "Physics" },
	{ key: "physics.class-ph", title: "Classical Physics", category: "Physics" },
	{
		key: "physics.comp-ph",
		title: "Computational Physics",
		category: "Physics",
	},
	{
		key: "physics.data-an",
		title: "Data Analysis, Statistics and Probability",
		category: "Physics",
	},
	{ key: "physics.flu-dyn", title: "Fluid Dynamics", category: "Physics" },
	{ key: "physics.gen-ph", title: "General Physics", category: "Physics" },
	{ key: "physics.geo-ph", title: "Geophysics", category: "Physics" },
	{
		key: "physics.hist-ph",
		title: "History and Philosophy of Physics",
		category: "Physics",
	},
	{
		key: "physics.ins-det",
		title: "Instrumentation and Detectors",
		category: "Physics",
	},
	{ key: "physics.med-ph", title: "Medical Physics", category: "Physics" },
	{ key: "physics.optics", title: "Optics", category: "Physics" },
	{ key: "physics.soc-ph", title: "Physics and Society", category: "Physics" },
	{ key: "physics.ed-ph", title: "Physics Education", category: "Physics" },
	{ key: "physics.plasm-ph", title: "Plasma Physics", category: "Physics" },
	{ key: "physics.pop-ph", title: "Popular Physics", category: "Physics" },
	{ key: "physics.space-ph", title: "Space Physics", category: "Physics" },

	{
		key: "quant-ph",
		title: "Quantum Physics",
		category: "Physics/Quantum Physics",
	},

	{
		key: "q-bio",
		title: "Quantitative Biology",
		category: "Quantitative Biology",
	},
	{ key: "q-bio.BM", title: "Biomolecules", category: "Quantitative Biology" },
	{ key: "q-bio.CB", title: "Cell Behavior", category: "Quantitative Biology" },
	{ key: "q-bio.GN", title: "Genomics", category: "Quantitative Biology" },
	{
		key: "q-bio.MN",
		title: "Molecular Networks",
		category: "Quantitative Biology",
	},
	{
		key: "q-bio.NC",
		title: "Neurons and Cognition",
		category: "Quantitative Biology",
	},
	{
		key: "q-bio.OT",
		title: "Other Quantitative Biology",
		category: "Quantitative Biology",
	},
	{
		key: "q-bio.PE",
		title: "Populations and Evolution",
		category: "Quantitative Biology",
	},
	{
		key: "q-bio.QM",
		title: "Quantitative Methods",
		category: "Quantitative Biology",
	},
	{
		key: "q-bio.SC",
		title: "Subcellular Processes",
		category: "Quantitative Biology",
	},
	{
		key: "q-bio.TO",
		title: "Tissues and Organs",
		category: "Quantitative Biology",
	},

	{
		key: "q-fin",
		title: "Quantitative Finance",
		category: "Quantitative Finance",
	},
	{
		key: "q-fin.CP",
		title: "Computational Finance",
		category: "Quantitative Finance",
	},
	{ key: "q-fin.EC", title: "Economics", category: "Quantitative Finance" },
	{
		key: "q-fin.GN",
		title: "General Finance",
		category: "Quantitative Finance",
	},
	{
		key: "q-fin.MF",
		title: "Mathematical Finance",
		category: "Quantitative Finance",
	},
	{
		key: "q-fin.PM",
		title: "Portfolio Management",
		category: "Quantitative Finance",
	},
	{
		key: "q-fin.PR",
		title: "Pricing of Securities",
		category: "Quantitative Finance",
	},
	{
		key: "q-fin.RM",
		title: "Risk Management",
		category: "Quantitative Finance",
	},
	{
		key: "q-fin.ST",
		title: "Statistical Finance",
		category: "Quantitative Finance",
	},
	{
		key: "q-fin.TR",
		title: "Trading and Market Microstructure",
		category: "Quantitative Finance",
	},

	{ key: "stat", title: "Statistics", category: "Statistics" },
	{ key: "stat.AP", title: "Applications", category: "Statistics" },
	{ key: "stat.CO", title: "Computation", category: "Statistics" },
	{ key: "stat.ML", title: "Machine Learning", category: "Statistics" },
	{ key: "stat.ME", title: "Methodology", category: "Statistics" },
	{ key: "stat.OT", title: "Other Statistics", category: "Statistics" },
	{ key: "stat.TH", title: "Statistics Theory", category: "Statistics" },
];
