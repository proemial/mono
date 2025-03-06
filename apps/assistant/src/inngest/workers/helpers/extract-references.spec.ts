import { extractPapers, LlmStep } from "../ask/extract-references";
import { describe, it, expect } from "vitest";

describe("uuid", () => {
	it("should extract references", () => {
		const result = extractPapers({ steps: fixture });
		// console.log(result);
		expect(result?.length).toEqual(10);
	});
});

const fixture: LlmStep[] = [
	{
		stepType: "initial",
		text: "",
		toolCalls: [
			{
				type: "tool-call",
				toolCallId: "call_7KO4SnMWL4paRTbOoI3b88uW",
				toolName: "searchPapers",
				args: { query: "trust in AI for therapy" },
			},
		],
		toolResults: [
			{
				toolCallId: "call_7KO4SnMWL4paRTbOoI3b88uW",
				toolName: "searchPapers",
				args: { query: "trust in AI for therapy" },
				result: {
					papers: [
						{
							score: 0.71408415,
							id: "https://openalex.org/W4394978403",
							title:
								"Artificial intelligence and psychotherapy: A counterpoint",
							created: "2024-04-21",
							abstract:
								"Abstract Psychotherapy practice is a human endeavour. Research on the specific and non‐specific factors of treatment has helped crystallise its relevance and clinical impact. The challenges currently faced by the field revolve around ensuring access to evidence‐based treatments and enhancing their effectiveness. Digitally delivered formats of empirically supported treatments increase access while supporting the relevance of the treatment‐specific ingredients and the necessity for human guidance. Excitement surrounds the potential integration of novel artificial intelligence (AI) machine learning methods to advance psychotherapy effectiveness. The abundance of data in digitally delivered formats positions them well to harness the capabilities of AI. Recent work provides proof of concept in areas including detection and diagnosis, predicting outcomes, treatment adherence, remission and relapse. A potential risk emerges when applying machine learning methods, in which an overreliance on AI inferences may overshadow the human aspect of psychotherapy. The contrast is simple: we may over‐invest in the rationality and relevance of our AI inferences, blindly obeying the algorithmic counsel that may lead to unintended consequences, such as oversimplifying human complexity. This would amount to changing psychotherapy from a human‐centric to a techno‐centric endeavour, something we should steadily avoid. This perspective highlights the importance of balancing enthusiasm for AI advancements with a cautious approach. The discussion outlines the risks associated with overdependence on AI and provides reasons to avoid a scenario in which psychotherapy loses its human essence. In conclusion, the perspective suggests avenues for future research to prevent such a transformation and maintain the human‐centric nature of psychotherapy.",
							features: [
								{
									id: "https://openalex.org/T11519",
									label: "Digital Mental Health",
									type: "topic",
									score: 0.9997,
								},
								{
									id: "https://openalex.org/T13283",
									label: "Network Analysis",
									type: "topic",
									score: 0.9996,
								},
								{
									id: "https://openalex.org/T11093",
									label: "Borderline Disorder",
									type: "topic",
									score: 0.9916,
								},
								{
									id: "https://openalex.org/keywords/counterpoint",
									label: "Counterpoint",
									type: "keyword",
									score: 0.9064764,
								},
								{
									id: "https://openalex.org/C12582419",
									label: "Counterpoint",
									type: "concept",
									score: 0.9064764,
								},
								{
									id: "https://openalex.org/C15744967",
									label: "Psychology",
									type: "concept",
									score: 0.7240945,
								},
								{
									id: "https://openalex.org/C542102704",
									label: "Psychotherapist",
									type: "concept",
									score: 0.6172853,
								},
								{
									id: "https://openalex.org/keywords/psychometric-models",
									label: "Psychometric Models",
									type: "keyword",
									score: 0.576167,
								},
								{
									id: "https://openalex.org/keywords/cognitive-behavioral-therapy",
									label: "Cognitive-Behavioral Therapy",
									type: "keyword",
									score: 0.563445,
								},
								{
									id: "https://openalex.org/keywords/mentalization-based-treatment",
									label: "Mentalization-Based Treatment",
									type: "keyword",
									score: 0.560809,
								},
								{
									id: "https://openalex.org/keywords/dialectical-behavior-therapy",
									label: "Dialectical Behavior Therapy",
									type: "keyword",
									score: 0.548986,
								},
								{
									id: "https://openalex.org/keywords/psychopathology",
									label: "Psychopathology",
									type: "keyword",
									score: 0.542048,
								},
								{
									id: "https://openalex.org/C11171543",
									label: "Psychoanalysis",
									type: "concept",
									score: 0.4844718,
								},
								{
									id: "https://openalex.org/C19417346",
									label: "Pedagogy",
									type: "concept",
									score: 0,
								},
							],
							authorships: [
								{
									author: {
										id: "https://openalex.org/A5065326687",
										display_name: "Derek Richards",
										institution: "Trinity College Dublin",
									},
								},
							],
							primary_location: {
								source: {
									display_name: "Counselling and Psychotherapy Research",
									host_organization_name: "Wiley",
								},
								landing_page_url: "https://doi.org/10.1002/capr.12758",
							},
							published: "2024-04-19",
						},
						{
							score: 0.71203005,
							id: "https://openalex.org/W4399356273",
							title: "Applications of AI in Psychotherapy: An Innovative Tool",
							created: "2024-06-06",
							abstract:
								'This paper explores the application and potential of artificial intelligence (AI) in psychological therapy as well as its implications for Chinese psychotherapy firm "JianDanXinLi" or otherwise known as SimpleTherapy. Through an analysis of several AI psychological therapy service platforms, it reveals the principles of integrating AI into modern psychotherapy and demonstrates that AI technology can serve as a flexible alternative and supplementary means for optimizing data in the therapeutic process. Although AI technology cannot fully replace human services, it can significantly expand and enhance the scope and effectiveness of therapy. Additionally, this paper discusses the challenges faced by AI technology in integrating psychological therapy, especially regarding issues of empathy.',
							features: [
								{
									id: "https://openalex.org/T11519",
									label: "Digital Mental Health",
									type: "topic",
									score: 0.8391,
								},
								{
									id: "https://openalex.org/T13283",
									label: "Network Analysis",
									type: "topic",
									score: 0.7213,
								},
								{
									id: "https://openalex.org/C542102704",
									label: "Psychotherapist",
									type: "concept",
									score: 0.6074601,
								},
								{
									id: "https://openalex.org/keywords/psychometric-models",
									label: "Psychometric Models",
									type: "keyword",
									score: 0.56655,
								},
								{
									id: "https://openalex.org/keywords/psychopathology",
									label: "Psychopathology",
									type: "keyword",
									score: 0.54114,
								},
								{
									id: "https://openalex.org/keywords/cognitive-behavioral-therapy",
									label: "Cognitive-Behavioral Therapy",
									type: "keyword",
									score: 0.539232,
								},
								{
									id: "https://openalex.org/keywords/therapist-support",
									label: "Therapist Support",
									type: "keyword",
									score: 0.523834,
								},
								{
									id: "https://openalex.org/keywords/internet-based-interventions",
									label: "Internet-based Interventions",
									type: "keyword",
									score: 0.523644,
								},
								{
									id: "https://openalex.org/C15744967",
									label: "Psychology",
									type: "concept",
									score: 0.4413297,
								},
								{
									id: "https://openalex.org/C188147891",
									label: "Cognitive science",
									type: "concept",
									score: 0.3596448,
								},
							],
							authorships: [
								{
									author: {
										id: "https://openalex.org/A5102682288",
										display_name: "Johnny Shanglin Du",
										institution: "United World College of South East Asia",
									},
								},
							],
							primary_location: {
								source: {
									display_name: "Cambridge Science Advance",
									host_organization_name: null,
								},
								landing_page_url: "https://doi.org/10.62852/csa/2024/8",
							},
							published: "2024-06-05",
						},
						{
							score: 0.7103702,
							id: "https://openalex.org/W4401648069",
							title: "Human-Human vs Human-AI Therapy: An Empirical Study",
							created: "2024-08-17",
							abstract:
								"In many nations, demand for mental health services currently outstrips supply, especially in the area of talk-based psychological interventions. Within this context, chatbots (software applications designed to simulate conversations with human users) are increasingly explored as potential adjuncts to traditional mental healthcare service delivery with a view to improving accessibility and reducing waiting times. However, the effectiveness and acceptability of such chatbots remains under-researched. This study evaluates mental health professionals' perceptions of Pi, a relational Artificial Intelligence (AI) chatbot, in the early stages of the psychotherapeutic process (problem exploration). We asked 63 therapists to assess therapy transcripts between a human client and Pi (human-AI) versus traditional therapy transcripts between therapists and clients (human-human). Therapists were unable to reliably discriminate between human-AI and human-human therapy transcripts. Therapists were accurate only 53.9% of the time, no better than chance, and rated the human-AI transcripts as higher quality on average. This study has potentially profound implications for the treatment of mental health problems, adding tentative support for the use of relational AI chatbots in providing initial assistance for mild to moderate psychological issues, especially when access to human therapists is constrained.",
							features: [
								{
									id: "https://openalex.org/T11519",
									label: "Digital Mental Health",
									type: "topic",
									score: 0.9969,
								},
								{
									id: "https://openalex.org/T12128",
									label: "AI in Service",
									type: "topic",
									score: 0.9938,
								},
								{
									id: "https://openalex.org/T10883",
									label: "AI Ethics",
									type: "topic",
									score: 0.9676,
								},
								{
									id: "https://openalex.org/keywords/human-robot-interaction",
									label: "Human-Robot Interaction",
									type: "keyword",
									score: 0.562569,
								},
								{
									id: "https://openalex.org/keywords/cognitive-behavioral-therapy",
									label: "Cognitive-Behavioral Therapy",
									type: "keyword",
									score: 0.538043,
								},
								{
									id: "https://openalex.org/keywords/therapist-support",
									label: "Therapist Support",
									type: "keyword",
									score: 0.521105,
								},
								{
									id: "https://openalex.org/keywords/voice-assistants",
									label: "Voice Assistants",
									type: "keyword",
									score: 0.5017,
								},
								{
									id: "https://openalex.org/keywords/behavioral-activation",
									label: "Behavioral Activation",
									type: "keyword",
									score: 0.50022,
								},
								{
									id: "https://openalex.org/C15744967",
									label: "Psychology",
									type: "concept",
									score: 0.38499185,
								},
							],
							authorships: [
								{
									author: {
										id: "https://openalex.org/A5048209907",
										display_name: "Mohammad Amin Kuhail",
										institution: "Zayed University",
									},
								},
								{
									author: {
										id: "https://openalex.org/A5020838797",
										display_name: "Nazik Alturki",
										institution: "Princess Nourah bint Abdulrahman University",
									},
								},
								{
									author: {
										id: "https://openalex.org/A5101089824",
										display_name: "Justin Thomas",
									},
								},
								{
									author: {
										id: "https://openalex.org/A5010155161",
										display_name: "Amal Khalifa Alkhalifa",
										institution: "Princess Nourah bint Abdulrahman University",
									},
								},
								{
									author: {
										id: "https://openalex.org/A5076202343",
										display_name: "Amal Alshardan",
										institution: "Princess Nourah bint Abdulrahman University",
									},
								},
							],
							primary_location: {
								source: {
									display_name:
										"International Journal of Human-Computer Interaction",
									host_organization_name: "Taylor & Francis",
								},
								landing_page_url:
									"https://doi.org/10.1080/10447318.2024.2385001",
							},
							published: "2024-08-16",
						},
						{
							score: 0.69300854,
							id: "https://openalex.org/W4403004333",
							title:
								"Who do I trust more? Public Perception on AI-driven Mental health Interventions: A Survey research (Preprint)",
							created: "2024-10-01",
							abstract:
								"Artificial intelligence (AI) has become increasingly important in health care, generating both curiosity and concern. With a doctor-patient ratio of 1:834 in India, AI has the potential to alleviate a significant health care burden. Public perception plays a crucial role in shaping attitudes that can facilitate the adoption of new technologies. Similarly, the acceptance of AI-driven mental health interventions is crucial in determining their effectiveness and widespread adoption. Therefore, it is essential to study public perceptions and usage of existing AI-driven mental health interventions by exploring user experiences and opinions on their future applicability, particularly in comparison to traditional, human-based interventions.",
							features: [
								{
									id: "https://openalex.org/T11519",
									label: "Digital Mental Health",
									type: "topic",
									score: 0.9963,
								},
								{
									id: "https://openalex.org/T13283",
									label: "Network Analysis",
									type: "topic",
									score: 0.9811,
								},
								{
									id: "https://openalex.org/T12488",
									label: "Language Analysis",
									type: "topic",
									score: 0.97,
								},
								{
									id: "https://openalex.org/keywords/preprint",
									label: "Preprint",
									type: "keyword",
									score: 0.90048593,
								},
								{
									id: "https://openalex.org/C43169469",
									label: "Preprint",
									type: "concept",
									score: 0.90048593,
								},
								{
									id: "https://openalex.org/C27415008",
									label: "Psychological intervention",
									type: "concept",
									score: 0.6779285,
								},
								{
									id: "https://openalex.org/C134362201",
									label: "Mental health",
									type: "concept",
									score: 0.6705434,
								},
								{
									id: "https://openalex.org/C26760741",
									label: "Perception",
									type: "concept",
									score: 0.5866521,
								},
								{
									id: "https://openalex.org/C15744967",
									label: "Psychology",
									type: "concept",
									score: 0.5511217,
								},
								{
									id: "https://openalex.org/keywords/survey-research",
									label: "Survey research",
									type: "keyword",
									score: 0.49300477,
								},
								{
									id: "https://openalex.org/C173481278",
									label: "Survey research",
									type: "concept",
									score: 0.49300477,
								},
								{
									id: "https://openalex.org/C75630572",
									label: "Applied psychology",
									type: "concept",
									score: 0.3665211,
								},
								{
									id: "https://openalex.org/C17744445",
									label: "Political science",
									type: "concept",
									score: 0.32603627,
								},
								{
									id: "https://openalex.org/C118552586",
									label: "Psychiatry",
									type: "concept",
									score: 0.18042797,
								},
								{
									id: "https://openalex.org/C41008148",
									label: "Computer science",
									type: "concept",
									score: 0.17103863,
								},
								{
									id: "https://openalex.org/C136764020",
									label: "World Wide Web",
									type: "concept",
									score: 0.081232846,
								},
								{
									id: "https://openalex.org/C169760540",
									label: "Neuroscience",
									type: "concept",
									score: 0,
								},
							],
							authorships: [
								{
									author: {
										id: "https://openalex.org/A5003352074",
										display_name: "Mahima Anna Varghese",
										institution: "Vellore Institute of Technology University",
									},
								},
								{
									author: {
										id: "https://openalex.org/A5005018481",
										display_name: "Poonam Sharma",
										institution: "Vellore Institute of Technology University",
									},
								},
								{
									author: {
										id: "https://openalex.org/A5104973569",
										display_name: "Maitreyee Patwardhan",
										institution: "India Habitat Centre",
									},
								},
							],
							primary_location: {
								source: {
									display_name: "JMIR Formative Research",
									host_organization_name: null,
								},
								landing_page_url: "https://doi.org/10.2196/64380",
							},
							published: "2024-09-30",
						},
						{
							score: 0.6915806,
							id: "https://openalex.org/W4396642133",
							title:
								"The emergence of AI in mental health: A transformative journey",
							created: "2024-05-05",
							abstract:
								"This paper traces the evolution of Artificial Intelligence (AI) in psychiatry, from early attempts like the ELIZA program to the integration of neuroimaging studies and the emergence of digital interventions. Utilizing deep learning models, AI now demonstrates high accuracy in classifying psychiatric disorders, such as schizophrenia based on functional connectivity patterns. The rise of AI chat/therapy bots, exemplified by Woebot and Tess, addresses mental health challenges, providing accessible and effective cognitive behavioral therapy tools. Innovative interventions like avatar therapy and intelligent animal-like robots contribute to broadening therapeutic perspectives. While AI-based interventions offer advantages in reducing stigma and increasing accessibility, challenges including diagnostic accuracy, legal responsibilities, and privacy concerns must be carefully considered. Despite challenges, the significant potential of AI in psychiatry calls for large, controlled trials, national standards, and responsible integration into clinical practice. The convergence of AI and psychiatry represents a technological revolution poised to transform mental health care delivery globally.",
							features: [
								{
									id: "https://openalex.org/T11519",
									label: "Digital Mental Health",
									type: "topic",
									score: 0.9895,
								},
								{
									id: "https://openalex.org/T13283",
									label: "Network Analysis",
									type: "topic",
									score: 0.9756,
								},
								{
									id: "https://openalex.org/T11636",
									label: "AI in Medicine",
									type: "topic",
									score: 0.964,
								},
								{
									id: "https://openalex.org/keywords/transformative-learning",
									label: "Transformative learning",
									type: "keyword",
									score: 0.88830996,
								},
								{
									id: "https://openalex.org/C70587473",
									label: "Transformative learning",
									type: "concept",
									score: 0.88830996,
								},
								{
									id: "https://openalex.org/C134362201",
									label: "Mental health",
									type: "concept",
									score: 0.62350494,
								},
								{
									id: "https://openalex.org/C15744967",
									label: "Psychology",
									type: "concept",
									score: 0.5454548,
								},
								{
									id: "https://openalex.org/keywords/therapist-support",
									label: "Therapist Support",
									type: "keyword",
									score: 0.481358,
								},
								{
									id: "https://openalex.org/C11171543",
									label: "Psychoanalysis",
									type: "concept",
									score: 0.40033424,
								},
								{
									id: "https://openalex.org/C144024400",
									label: "Sociology",
									type: "concept",
									score: 0.33160913,
								},
								{
									id: "https://openalex.org/C542102704",
									label: "Psychotherapist",
									type: "concept",
									score: 0.27596053,
								},
								{
									id: "https://openalex.org/C138496976",
									label: "Developmental psychology",
									type: "concept",
									score: 0.21165526,
								},
							],
							authorships: [
								{
									author: {
										id: "https://openalex.org/A5095931546",
										display_name: "Vinod Kumar Dhiman",
										institution:
											"Deenbandhu Chhotu Ram University of Science and Technology",
									},
								},
							],
							primary_location: {
								source: {
									display_name:
										"World Journal of Advanced Research and Reviews",
									host_organization_name: "GSC Online Press",
								},
								landing_page_url:
									"https://doi.org/10.30574/wjarr.2024.22.1.1298",
							},
							published: "2024-04-30",
						},
						{
							score: 0.6869842,
							id: "https://openalex.org/W4391108112",
							title:
								"Considering AI-driven therapy: When does human empathy matter? (Preprint)",
							created: "2024-01-23",
							abstract:
								"<sec> <title>UNSTRUCTURED</title> Recent breakthroughs in artificial intelligence (AI) language models have elevated the vision of using conversational AI support for mental health, with a growing body of literature indicating varying degrees of efficacy. In this paper, we ask when, in therapy, it will be easier to replace humans and, conversely, in what instances, human connection will still be more valued. We suggest that empathy lies at the heart of the answer to this question. First, we define different aspects of empathy and outline the potential empathic capabilities of humans versus AI. Next, we consider what determines when these aspects are needed most in therapy, both from the perspective of therapeutic methodology and from the perspective of patient objectives. Ultimately, our goal is to prompt further investigation and dialogue, urging both practitioners and scholars engaged in AI-mediated therapy to keep these questions and considerations in mind when investigating AI implementation in mental health. </sec>",
							features: [
								{
									id: "https://openalex.org/T11519",
									label: "Digital Mental Health",
									type: "topic",
									score: 0.9999,
								},
								{
									id: "https://openalex.org/T13283",
									label: "Network Analysis",
									type: "topic",
									score: 0.9997,
								},
								{
									id: "https://openalex.org/T11093",
									label: "Borderline Disorder",
									type: "topic",
									score: 0.9962,
								},
								{
									id: "https://openalex.org/C2779885105",
									label: "Empathy",
									type: "concept",
									score: 0.9094653,
								},
								{
									id: "https://openalex.org/C12713177",
									label: "Perspective (graphical)",
									type: "concept",
									score: 0.77706486,
								},
								{
									id: "https://openalex.org/keywords/preprint",
									label: "Preprint",
									type: "keyword",
									score: 0.69605315,
								},
								{
									id: "https://openalex.org/C43169469",
									label: "Preprint",
									type: "concept",
									score: 0.69605315,
								},
								{
									id: "https://openalex.org/C15744967",
									label: "Psychology",
									type: "concept",
									score: 0.5121162,
								},
								{
									id: "https://openalex.org/keywords/therapist-support",
									label: "Therapist Support",
									type: "keyword",
									score: 0.50315,
								},
								{
									id: "https://openalex.org/C134362201",
									label: "Mental health",
									type: "concept",
									score: 0.44348887,
								},
								{
									id: "https://openalex.org/C188147891",
									label: "Cognitive science",
									type: "concept",
									score: 0.43078423,
								},
								{
									id: "https://openalex.org/C542102704",
									label: "Psychotherapist",
									type: "concept",
									score: 0.43013006,
								},
								{
									id: "https://openalex.org/C105409693",
									label: "Human intelligence",
									type: "concept",
									score: 0.42075717,
								},
								{
									id: "https://openalex.org/C111472728",
									label: "Epistemology",
									type: "concept",
									score: 0.34249896,
								},
								{
									id: "https://openalex.org/C41008148",
									label: "Computer science",
									type: "concept",
									score: 0.24293402,
								},
								{
									id: "https://openalex.org/C154945302",
									label: "Artificial intelligence",
									type: "concept",
									score: 0.24079987,
								},
								{
									id: "https://openalex.org/C77805123",
									label: "Social psychology",
									type: "concept",
									score: 0.1816862,
								},
								{
									id: "https://openalex.org/C138496976",
									label: "Developmental psychology",
									type: "concept",
									score: 0.09968531,
								},
								{
									id: "https://openalex.org/C138885662",
									label: "Philosophy",
									type: "concept",
									score: 0.07820511,
								},
								{
									id: "https://openalex.org/C136764020",
									label: "World Wide Web",
									type: "concept",
									score: 0,
								},
							],
							authorships: [
								{
									author: {
										id: "https://openalex.org/A5104285776",
										display_name: "Matan Rubin",
									},
								},
								{
									author: {
										id: "https://openalex.org/A5093763070",
										display_name: "Hadar Arnon",
									},
								},
								{
									author: {
										id: "https://openalex.org/A5042405428",
										display_name: "Jonathan D. Huppert",
									},
								},
								{
									author: {
										id: "https://openalex.org/A5054907278",
										display_name: "Anat Perry",
									},
								},
							],
							primary_location: {
								source: {},
								landing_page_url: "https://doi.org/10.2196/preprints.56529",
							},
							published: "2024-01-18",
						},
						{
							score: 0.683903,
							id: "https://openalex.org/W4392354123",
							title:
								"Artificial Intelligence in nursing: trustworthy or reliable?",
							created: "2024-03-05",
							abstract:
								"Trustworthiness in Artificial Intelligence (AI) innovation is a priority for governments, researchers and clinicians; however, clinicians have highlighted trust and confidence as barriers to their acceptance of AI within a clinical application. While there is a call to design and develop AI that is considered trustworthy, AI still lacks the emotional capability to facilitate the reciprocal nature of trust.",
							features: [
								{
									id: "https://openalex.org/T11636",
									label: "AI in Medicine",
									type: "topic",
									score: 0.9993,
								},
								{
									id: "https://openalex.org/T10177",
									label: "Palliative Care",
									type: "topic",
									score: 0.9723,
								},
								{
									id: "https://openalex.org/T10416",
									label: "Brain Injury",
									type: "topic",
									score: 0.9492,
								},
								{
									id: "https://openalex.org/keywords/trustworthiness",
									label: "Trustworthiness",
									type: "keyword",
									score: 0.924162,
								},
								{
									id: "https://openalex.org/C153701036",
									label: "Trustworthiness",
									type: "concept",
									score: 0.924162,
								},
								{
									id: "https://openalex.org/keywords/reciprocal",
									label: "Reciprocal",
									type: "keyword",
									score: 0.5832353,
								},
								{
									id: "https://openalex.org/C2777742833",
									label: "Reciprocal",
									type: "concept",
									score: 0.5832353,
								},
								{
									id: "https://openalex.org/C15744967",
									label: "Psychology",
									type: "concept",
									score: 0.48273486,
								},
								{
									id: "https://openalex.org/C159110408",
									label: "Nursing",
									type: "concept",
									score: 0.45881423,
								},
								{
									id: "https://openalex.org/keywords/artificial-intelligences",
									label: "Artificial Intelligences",
									type: "keyword",
									score: 0.446357,
								},
								{
									id: "https://openalex.org/C41008148",
									label: "Computer science",
									type: "concept",
									score: 0.42549077,
								},
								{
									id: "https://openalex.org/C56739046",
									label: "Knowledge management",
									type: "concept",
									score: 0.42530334,
								},
								{
									id: "https://openalex.org/C154945302",
									label: "Artificial intelligence",
									type: "concept",
									score: 0.33646774,
								},
								{
									id: "https://openalex.org/C71924100",
									label: "Medicine",
									type: "concept",
									score: 0.3072965,
								},
								{
									id: "https://openalex.org/C77805123",
									label: "Social psychology",
									type: "concept",
									score: 0.2274571,
								},
								{
									id: "https://openalex.org/C41895202",
									label: "Linguistics",
									type: "concept",
									score: 0,
								},
								{
									id: "https://openalex.org/C138885662",
									label: "Philosophy",
									type: "concept",
									score: 0,
								},
							],
							authorships: [
								{
									author: {
										id: "https://openalex.org/A5076828804",
										display_name: "Oliver Higgins",
										institution: "University of Newcastle Australia",
									},
								},
								{
									author: {
										id: "https://openalex.org/A5054614441",
										display_name: "Stephan K. Chalup",
									},
								},
								{
									author: {
										id: "https://openalex.org/A5029316442",
										display_name: "Rhonda Wilson",
										institution: "Gosford Hospital",
									},
								},
							],
							primary_location: {
								source: {
									display_name: "Journal of research in nursing",
									host_organization_name: "SAGE Publishing",
								},
								landing_page_url: "https://doi.org/10.1177/17449871231215696",
							},
							published: "2024-02-29",
						},
						{
							score: 0.68323505,
							id: "https://openalex.org/W4403962195",
							title:
								"Can AI replace psychotherapists? Exploring the future of mental health care",
							created: "2024-11-01",
							abstract:
								"against the growing prevalence of mental health issues (7,8).AI's role in mental health care is multifaceted, encompassing predictive analytics, therapeutic interventions, clinician support tools, and patient monitoring systems (9). For instance, AI algorithms are increasingly used to predict treatment outcomes by analyzing patient data (10). Meanwhile, AI-powered interventions, such as virtual reality exposure therapy and chatbot-delivered cognitive behavioral therapy, are being explored, though they are at varying stages of validation (11,12). Each of these applications is evolving at its own pace, influenced by technological advancements and the need for rigorous clinical validation.AI's capabilities in handling extensive datasets and analyzing complex behavioral patterns position it as a revolutionary force capable of transforming mental health care by offering advanced detection methods, personalized treatment plans, and virtual therapeutic platforms that could dramatically increase accessibility, reduce stigma, and enhance treatment outcomes (13,14,15,4).Furthermore, the role of AI in mental health extends to potentially replacing certain functions traditionally performed by human psychotherapists. Innovations in machine learning and natural language processing have enabled AI systems like ChatGPT to recognize and process complex human emotions, facilitating interactions that once required the nuanced understanding of trained therapists (16,17). Preliminary studies suggest that AI-powered chatbots may help alleviate symptoms of anxiety and depression (18,19). However, these studies often involve small participant groups and lack long-term follow-up, making it difficult to draw definitive conclusions about their effectiveness. Consequently, while AI interventions hold promise, further research through large-scale, randomized controlled trials is necessary to establish their efficacy and sustainability over time.Studies have shown that AI-powered chatbots can effectively reduce symptoms of anxiety and depression, offering a level of interaction that suggests machines might soon match or even surpass human capabilities in certain aspects of psychotherapy (18,19,20,21).Although these studies indicate short-term benefits, meta-analyses have shown that these effects may not be sustained in the long term, with no significant changes observed over extended periods (22).As AI continues to evolve and become more deeply integrated into the mental healthcare sector, its potential to fundamentally transform the field is undeniable. At a time when mental health issues have reached pandemic proportions globally, affecting productivity and quality of life (23,24), the need for innovative solutions is urgent.",
							features: [
								{
									id: "https://openalex.org/T10272",
									label: "Stigma Impact",
									type: "topic",
									score: 0.9982,
								},
								{
									id: "https://openalex.org/T11519",
									label: "Digital Mental Health",
									type: "topic",
									score: 0.9967,
								},
								{
									id: "https://openalex.org/T12308",
									label: "Health Philosophy",
									type: "topic",
									score: 0.9904,
								},
								{
									id: "https://openalex.org/C134362201",
									label: "Mental health",
									type: "concept",
									score: 0.6167934,
								},
								{
									id: "https://openalex.org/C15744967",
									label: "Psychology",
									type: "concept",
									score: 0.6096347,
								},
								{
									id: "https://openalex.org/keywords/mental-health-care",
									label: "Mental Health Care",
									type: "keyword",
									score: 0.5092696,
								},
								{
									id: "https://openalex.org/C2992545881",
									label: "Mental health care",
									type: "concept",
									score: 0.5092696,
								},
								{
									id: "https://openalex.org/C542102704",
									label: "Psychotherapist",
									type: "concept",
									score: 0.42161185,
								},
							],
							authorships: [
								{
									author: {
										id: "https://openalex.org/A5100451619",
										display_name: "Zhihui Zhang",
										institution: "Universitat Politècnica de Catalunya",
									},
								},
								{
									author: {
										id: "https://openalex.org/A5100378370",
										display_name: "Jing Wang",
										institution: "Shenzhen Second People's Hospital",
									},
								},
							],
							primary_location: {
								source: {
									display_name: "Frontiers in Psychiatry",
									host_organization_name: "Frontiers Media",
								},
								landing_page_url: "https://doi.org/10.3389/fpsyt.2024.1444382",
							},
							published: "2024-10-31",
						},
						{
							score: 0.68091685,
							id: "https://openalex.org/W4395055188",
							title:
								"Considering the Role of Human Empathy in AI-Driven Therapy",
							created: "2024-04-24",
							abstract:
								"Recent breakthroughs in artificial intelligence (AI) language models have elevated the vision of using conversational AI support for mental health, with a growing body of literature indicating varying degrees of efficacy. In this paper, we ask when, in therapy, it will be easier to replace humans and, conversely, in what instances, human connection will still be more valued. We suggest that empathy lies at the heart of the answer to this question. First, we define different aspects of empathy and outline the potential empathic capabilities of humans versus AI. Next, we consider what determines when these aspects are needed most in therapy, both from the perspective of therapeutic methodology and from the perspective of patient objectives. Ultimately, our goal is to prompt further investigation and dialogue, urging both practitioners and scholars engaged in AI-mediated therapy to keep these questions and considerations in mind when investigating AI implementation in mental health.",
							features: [
								{
									id: "https://openalex.org/T11519",
									label: "Digital Mental Health",
									type: "topic",
									score: 0.9991,
								},
								{
									id: "https://openalex.org/T13283",
									label: "Network Analysis",
									type: "topic",
									score: 0.9971,
								},
								{
									id: "https://openalex.org/T12308",
									label: "Health Philosophy",
									type: "topic",
									score: 0.9834,
								},
								{
									id: "https://openalex.org/C2779885105",
									label: "Empathy",
									type: "concept",
									score: 0.57700056,
								},
								{
									id: "https://openalex.org/keywords/therapist-support",
									label: "Therapist Support",
									type: "keyword",
									score: 0.569166,
								},
								{
									id: "https://openalex.org/keywords/cognitive-behavioral-therapy",
									label: "Cognitive-Behavioral Therapy",
									type: "keyword",
									score: 0.565075,
								},
								{
									id: "https://openalex.org/keywords/temporal-experience",
									label: "Temporal Experience",
									type: "keyword",
									score: 0.553337,
								},
								{
									id: "https://openalex.org/C542102704",
									label: "Psychotherapist",
									type: "concept",
									score: 0.53896755,
								},
								{
									id: "https://openalex.org/keywords/person-centered-medicine",
									label: "Person-Centered Medicine",
									type: "keyword",
									score: 0.535963,
								},
								{
									id: "https://openalex.org/keywords/psychometric-models",
									label: "Psychometric Models",
									type: "keyword",
									score: 0.526327,
								},
								{
									id: "https://openalex.org/C15744967",
									label: "Psychology",
									type: "concept",
									score: 0.51501226,
								},
								{
									id: "https://openalex.org/C71924100",
									label: "Medicine",
									type: "concept",
									score: 0.3424691,
								},
								{
									id: "https://openalex.org/C118552586",
									label: "Psychiatry",
									type: "concept",
									score: 0.1826179,
								},
							],
							authorships: [
								{
									author: {
										id: "https://openalex.org/A5104285776",
										display_name: "Matan Rubin",
									},
								},
								{
									author: {
										id: "https://openalex.org/A5093763070",
										display_name: "Hadar Arnon",
									},
								},
								{
									author: {
										id: "https://openalex.org/A5042405428",
										display_name: "Jonathan D. Huppert",
									},
								},
								{
									author: {
										id: "https://openalex.org/A5054907278",
										display_name: "Anat Perry",
									},
								},
							],
							primary_location: {
								source: {
									display_name: "JMIR Mental Health",
									host_organization_name: "JMIR Publications",
								},
								landing_page_url: "https://doi.org/10.2196/56529",
							},
							published: "2024-04-23",
						},
						{
							score: 0.67765296,
							id: "https://openalex.org/W4396974499",
							title:
								"(Why) Do We Trust AI?: A Case of AI-based Health Chatbots",
							created: "2024-05-17",
							abstract:
								"Automated chatbots powered by artificial intelligence (AI) can act as a ubiquitous point of contact, improving access to healthcare and empowering users to make effective decisions. However, despite the potential benefits, emerging literature suggests that apprehensions linked to the distinctive features of AI technology and the specific context of use (healthcare) could undermine consumer trust and hinder widespread adoption. Although the role of trust is considered pivotal to the acceptance of healthcare technologies, a dearth of research exists that focuses on the contextual factors that drive trust in such AI-based Chatbots for Self-Diagnosis (AICSD). Accordingly, a contextual model based on the trust-in-technology framework was developed to understand the determinants of consumers’ trust in AICSD and its behavioral consequences. It was validated using a free simulation experiment study in India (N = 202). Perceived anthropomorphism, perceived information quality, perceived explainability, disposition to trust technology, and perceived service quality influence consumers’ trust in AICSD. In turn, trust, privacy risk, health risk, and gender determine the intention to use. The research contributes by developing and validating a context-specific model for explaining trust in AICSD that could aid developers and marketers in enhancing consumers’ trust in and adoption of AICSD.",
							features: [
								{
									id: "https://openalex.org/T11519",
									label: "Digital Mental Health",
									type: "topic",
									score: 0.8863,
								},
								{
									id: "https://openalex.org/T10883",
									label: "AI Ethics",
									type: "topic",
									score: 0.8856,
								},
								{
									id: "https://openalex.org/T12128",
									label: "AI in Service",
									type: "topic",
									score: 0.8854,
								},
								{
									id: "https://openalex.org/keywords/chatbots",
									label: "Chatbots",
									type: "keyword",
									score: 0.620733,
								},
								{
									id: "https://openalex.org/keywords/human-robot-interaction",
									label: "Human-Robot Interaction",
									type: "keyword",
									score: 0.509968,
								},
								{
									id: "https://openalex.org/keywords/artificial-intelligences",
									label: "Artificial Intelligences",
									type: "keyword",
									score: 0.502468,
								},
								{
									id: "https://openalex.org/C15744967",
									label: "Psychology",
									type: "concept",
									score: 0.4361616,
								},
								{
									id: "https://openalex.org/C41008148",
									label: "Computer science",
									type: "concept",
									score: 0.39939684,
								},
								{
									id: "https://openalex.org/C154945302",
									label: "Artificial intelligence",
									type: "concept",
									score: 0.37931553,
								},
							],
							authorships: [
								{
									author: {
										id: "https://openalex.org/A5084138407",
										display_name: "Ashish Viswanath Prakash",
										institution:
											"Indian Institute of Management Tiruchirappalli",
									},
								},
								{
									author: {
										id: "https://openalex.org/A5048474556",
										display_name: "Saini Das",
										institution: "Indian Institute of Technology Kharagpur",
									},
								},
							],
							primary_location: {
								source: {
									display_name:
										"AJIS. Australasian journal of information systems/AJIS. Australian journal of information systems/Australian journal of information systems",
									host_organization_name:
										"Australasian Association for Information Systems",
								},
								landing_page_url: "https://doi.org/10.3127/ajis.v28.4235",
							},
							published: "2024-05-15",
						},
					],
				},
			},
		],
		finishReason: "stop",
		usage: {
			promptTokens: 815,
			completionTokens: 20,
			totalTokens: 835,
		},
		warnings: [],
		request: {
			body: '{"model":"gpt-4o","temperature":0,"messages":[{"role":"system","content":"\\nYou are a helpful high school teacher that provides conclusive answers to user questions, based on research papers provided by the `getPapers` tool, and supplementing the information in research papers with your general knowledge.\\n\\nWhenever a user ask a question, you should always use the `getPapers` tool and base your answer on the most relevant research papers from the `getPapers` result set. \\n\\nOnly if not relevant research is found, are you allowed to answer base on your general knowledge. And is these cases, you should start your reply by stating that no relevant research was found.\\n\\nRules:\\n- Your answer should not exceed 60 words.\\n- Your answer should use layman\'s terminology, not scientific jargon.\\n- Do not repeat the user\'s question in your answer.\\n- Answers should be short and concise: two or three sentences that reference facts and findings from the research papers. \\n- Try to reference at least three papers in every answer.\\n- Use numerical references to the research papers using brackets: [1], [2], etc.\\n- Do not include a reference list in your ouytput. The user will already have the list.\\n- Do not start your answer with \\"Based on the research papers...\\" or similar. Just start with your answer without any introduction.\\n\\nStep 1: Determine if an answer to the user question may supported by research.\\nStep 2: Use the `getPapers` tool to find the most relevant research papers.\\nStep 3: Review the research papers retrieved and determine which papers to reference in the answer.\\nStep 4: Construct a short and concise answer in two or three sentences based on facts and findings from the research papers.\\n"},{"role":"user","content":"Is online therapy effective?"},{"role":"assistant","content":"Online therapy is generally effective, offering accessibility and convenience [1]. Online Cognitive Behavioral Therapy (CBT) shows significant improvements in depression [2]. However, challenges like reduced nonverbal communication and technical issues can affect its effectiveness [3]. Despite these challenges, online therapy remains a viable option, especially when combined with in-person sessions [4]., with interactive elements"},{"role":"user","content":"Why is this important"},{"role":"assistant","content":"Online therapy is important because it increases accessibility to mental health services, especially for those in remote areas or with mobility issues [1]. It also reduces barriers like stigma and cost, making therapy more inclusive [2]. During the COVID-19 pandemic, it provided a crucial alternative to in-person sessions, ensuring continuity of care [3]., with interactive elements"},{"role":"user","content":"tell me more"},{"role":"assistant","content":"Online therapy is crucial for its accessibility, reducing barriers like stigma and cost [1]. It offers flexibility and convenience, especially during crises like the COVID-19 pandemic [2]. Despite challenges like reduced nonverbal communication, it remains a valuable tool, often complementing in-person therapy [3]., with interactive elements"},{"role":"user","content":"but what now?"},{"role":"assistant","content":"Online therapy continues to be a significant mode of mental health care, especially post-COVID-19. It offers accessibility and convenience, though challenges like nonverbal communication and confidentiality persist [1]. Therapists and clients have adapted, finding online therapy effective, especially when combined with in-person sessions [2]. Training for therapists in digital skills is crucial for maximizing its benefits [3]., with interactive elements"},{"role":"user","content":"where is it heading"},{"role":"assistant","content":"The future of online therapy is promising, with increased integration of digital technologies like AI and virtual reality to enhance therapeutic experiences [1]. The demand for online mental health services is growing, driven by accessibility and convenience [2]. However, challenges like ensuring confidentiality and improving digital competencies remain [3]. Training and adaptation are crucial for maximizing its potential [4]., with interactive elements"},{"role":"user","content":"will clients trust AI"}],"tools":[{"type":"function","function":{"name":"searchPapers","description":"Find specific research papers matching a user query","parameters":{"type":"object","properties":{"query":{"type":"string","description":"The search query"}},"required":["query"],"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"}}}],"tool_choice":"auto"}',
		},
		response: {
			id: "chatcmpl-B0RQAbwWzonWUhuZyJVwOqGu4p94V",
			timestamp: new Date("2025-02-13T11:11:46.000Z"),
			modelId: "gpt-4o-2024-08-06",
			messages: [
				{
					role: "assistant",
					content: [
						{ type: "text", text: "" },
						{
							type: "tool-call",
							toolCallId: "call_7KO4SnMWL4paRTbOoI3b88uW",
							toolName: "searchPapers",
							args: { query: "trust in AI for therapy" },
						},
					],
				},
				{
					role: "tool",
					content: [
						{
							type: "tool-result",
							toolCallId: "call_7KO4SnMWL4paRTbOoI3b88uW",
							toolName: "searchPapers",
							result: {
								papers: [
									{
										score: 0.71408415,
										id: "https://openalex.org/W4394978403",
										title:
											"Artificial intelligence and psychotherapy: A counterpoint",
										created: "2024-04-21",
										abstract:
											"Abstract Psychotherapy practice is a human endeavour. Research on the specific and non‐specific factors of treatment has helped crystallise its relevance and clinical impact. The challenges currently faced by the field revolve around ensuring access to evidence‐based treatments and enhancing their effectiveness. Digitally delivered formats of empirically supported treatments increase access while supporting the relevance of the treatment‐specific ingredients and the necessity for human guidance. Excitement surrounds the potential integration of novel artificial intelligence (AI) machine learning methods to advance psychotherapy effectiveness. The abundance of data in digitally delivered formats positions them well to harness the capabilities of AI. Recent work provides proof of concept in areas including detection and diagnosis, predicting outcomes, treatment adherence, remission and relapse. A potential risk emerges when applying machine learning methods, in which an overreliance on AI inferences may overshadow the human aspect of psychotherapy. The contrast is simple: we may over‐invest in the rationality and relevance of our AI inferences, blindly obeying the algorithmic counsel that may lead to unintended consequences, such as oversimplifying human complexity. This would amount to changing psychotherapy from a human‐centric to a techno‐centric endeavour, something we should steadily avoid. This perspective highlights the importance of balancing enthusiasm for AI advancements with a cautious approach. The discussion outlines the risks associated with overdependence on AI and provides reasons to avoid a scenario in which psychotherapy loses its human essence. In conclusion, the perspective suggests avenues for future research to prevent such a transformation and maintain the human‐centric nature of psychotherapy.",
										features: [
											{
												id: "https://openalex.org/T11519",
												label: "Digital Mental Health",
												type: "topic",
												score: 0.9997,
											},
											{
												id: "https://openalex.org/T13283",
												label: "Network Analysis",
												type: "topic",
												score: 0.9996,
											},
											{
												id: "https://openalex.org/T11093",
												label: "Borderline Disorder",
												type: "topic",
												score: 0.9916,
											},
											{
												id: "https://openalex.org/keywords/counterpoint",
												label: "Counterpoint",
												type: "keyword",
												score: 0.9064764,
											},
											{
												id: "https://openalex.org/C12582419",
												label: "Counterpoint",
												type: "concept",
												score: 0.9064764,
											},
											{
												id: "https://openalex.org/C15744967",
												label: "Psychology",
												type: "concept",
												score: 0.7240945,
											},
											{
												id: "https://openalex.org/C542102704",
												label: "Psychotherapist",
												type: "concept",
												score: 0.6172853,
											},
											{
												id: "https://openalex.org/keywords/psychometric-models",
												label: "Psychometric Models",
												type: "keyword",
												score: 0.576167,
											},
											{
												id: "https://openalex.org/keywords/cognitive-behavioral-therapy",
												label: "Cognitive-Behavioral Therapy",
												type: "keyword",
												score: 0.563445,
											},
											{
												id: "https://openalex.org/keywords/mentalization-based-treatment",
												label: "Mentalization-Based Treatment",
												type: "keyword",
												score: 0.560809,
											},
											{
												id: "https://openalex.org/keywords/dialectical-behavior-therapy",
												label: "Dialectical Behavior Therapy",
												type: "keyword",
												score: 0.548986,
											},
											{
												id: "https://openalex.org/keywords/psychopathology",
												label: "Psychopathology",
												type: "keyword",
												score: 0.542048,
											},
											{
												id: "https://openalex.org/C11171543",
												label: "Psychoanalysis",
												type: "concept",
												score: 0.4844718,
											},
											{
												id: "https://openalex.org/C19417346",
												label: "Pedagogy",
												type: "concept",
												score: 0,
											},
										],
										authorships: [
											{
												author: {
													id: "https://openalex.org/A5065326687",
													display_name: "Derek Richards",
													institution: "Trinity College Dublin",
												},
											},
										],
										primary_location: {
											source: {
												display_name: "Counselling and Psychotherapy Research",
												host_organization_name: "Wiley",
											},
											landing_page_url: "https://doi.org/10.1002/capr.12758",
										},
										published: "2024-04-19",
									},
									{
										score: 0.71203005,
										id: "https://openalex.org/W4399356273",
										title:
											"Applications of AI in Psychotherapy: An Innovative Tool",
										created: "2024-06-06",
										abstract:
											'This paper explores the application and potential of artificial intelligence (AI) in psychological therapy as well as its implications for Chinese psychotherapy firm "JianDanXinLi" or otherwise known as SimpleTherapy. Through an analysis of several AI psychological therapy service platforms, it reveals the principles of integrating AI into modern psychotherapy and demonstrates that AI technology can serve as a flexible alternative and supplementary means for optimizing data in the therapeutic process. Although AI technology cannot fully replace human services, it can significantly expand and enhance the scope and effectiveness of therapy. Additionally, this paper discusses the challenges faced by AI technology in integrating psychological therapy, especially regarding issues of empathy.',
										features: [
											{
												id: "https://openalex.org/T11519",
												label: "Digital Mental Health",
												type: "topic",
												score: 0.8391,
											},
											{
												id: "https://openalex.org/T13283",
												label: "Network Analysis",
												type: "topic",
												score: 0.7213,
											},
											{
												id: "https://openalex.org/C542102704",
												label: "Psychotherapist",
												type: "concept",
												score: 0.6074601,
											},
											{
												id: "https://openalex.org/keywords/psychometric-models",
												label: "Psychometric Models",
												type: "keyword",
												score: 0.56655,
											},
											{
												id: "https://openalex.org/keywords/psychopathology",
												label: "Psychopathology",
												type: "keyword",
												score: 0.54114,
											},
											{
												id: "https://openalex.org/keywords/cognitive-behavioral-therapy",
												label: "Cognitive-Behavioral Therapy",
												type: "keyword",
												score: 0.539232,
											},
											{
												id: "https://openalex.org/keywords/therapist-support",
												label: "Therapist Support",
												type: "keyword",
												score: 0.523834,
											},
											{
												id: "https://openalex.org/keywords/internet-based-interventions",
												label: "Internet-based Interventions",
												type: "keyword",
												score: 0.523644,
											},
											{
												id: "https://openalex.org/C15744967",
												label: "Psychology",
												type: "concept",
												score: 0.4413297,
											},
											{
												id: "https://openalex.org/C188147891",
												label: "Cognitive science",
												type: "concept",
												score: 0.3596448,
											},
										],
										authorships: [
											{
												author: {
													id: "https://openalex.org/A5102682288",
													display_name: "Johnny Shanglin Du",
													institution:
														"United World College of South East Asia",
												},
											},
										],
										primary_location: {
											source: {
												display_name: "Cambridge Science Advance",
												host_organization_name: null,
											},
											landing_page_url: "https://doi.org/10.62852/csa/2024/8",
										},
										published: "2024-06-05",
									},
									{
										score: 0.7103702,
										id: "https://openalex.org/W4401648069",
										title:
											"Human-Human vs Human-AI Therapy: An Empirical Study",
										created: "2024-08-17",
										abstract:
											"In many nations, demand for mental health services currently outstrips supply, especially in the area of talk-based psychological interventions. Within this context, chatbots (software applications designed to simulate conversations with human users) are increasingly explored as potential adjuncts to traditional mental healthcare service delivery with a view to improving accessibility and reducing waiting times. However, the effectiveness and acceptability of such chatbots remains under-researched. This study evaluates mental health professionals' perceptions of Pi, a relational Artificial Intelligence (AI) chatbot, in the early stages of the psychotherapeutic process (problem exploration). We asked 63 therapists to assess therapy transcripts between a human client and Pi (human-AI) versus traditional therapy transcripts between therapists and clients (human-human). Therapists were unable to reliably discriminate between human-AI and human-human therapy transcripts. Therapists were accurate only 53.9% of the time, no better than chance, and rated the human-AI transcripts as higher quality on average. This study has potentially profound implications for the treatment of mental health problems, adding tentative support for the use of relational AI chatbots in providing initial assistance for mild to moderate psychological issues, especially when access to human therapists is constrained.",
										features: [
											{
												id: "https://openalex.org/T11519",
												label: "Digital Mental Health",
												type: "topic",
												score: 0.9969,
											},
											{
												id: "https://openalex.org/T12128",
												label: "AI in Service",
												type: "topic",
												score: 0.9938,
											},
											{
												id: "https://openalex.org/T10883",
												label: "AI Ethics",
												type: "topic",
												score: 0.9676,
											},
											{
												id: "https://openalex.org/keywords/human-robot-interaction",
												label: "Human-Robot Interaction",
												type: "keyword",
												score: 0.562569,
											},
											{
												id: "https://openalex.org/keywords/cognitive-behavioral-therapy",
												label: "Cognitive-Behavioral Therapy",
												type: "keyword",
												score: 0.538043,
											},
											{
												id: "https://openalex.org/keywords/therapist-support",
												label: "Therapist Support",
												type: "keyword",
												score: 0.521105,
											},
											{
												id: "https://openalex.org/keywords/voice-assistants",
												label: "Voice Assistants",
												type: "keyword",
												score: 0.5017,
											},
											{
												id: "https://openalex.org/keywords/behavioral-activation",
												label: "Behavioral Activation",
												type: "keyword",
												score: 0.50022,
											},
											{
												id: "https://openalex.org/C15744967",
												label: "Psychology",
												type: "concept",
												score: 0.38499185,
											},
										],
										authorships: [
											{
												author: {
													id: "https://openalex.org/A5048209907",
													display_name: "Mohammad Amin Kuhail",
													institution: "Zayed University",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5020838797",
													display_name: "Nazik Alturki",
													institution:
														"Princess Nourah bint Abdulrahman University",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5101089824",
													display_name: "Justin Thomas",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5010155161",
													display_name: "Amal Khalifa Alkhalifa",
													institution:
														"Princess Nourah bint Abdulrahman University",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5076202343",
													display_name: "Amal Alshardan",
													institution:
														"Princess Nourah bint Abdulrahman University",
												},
											},
										],
										primary_location: {
											source: {
												display_name:
													"International Journal of Human-Computer Interaction",
												host_organization_name: "Taylor & Francis",
											},
											landing_page_url:
												"https://doi.org/10.1080/10447318.2024.2385001",
										},
										published: "2024-08-16",
									},
									{
										score: 0.69300854,
										id: "https://openalex.org/W4403004333",
										title:
											"Who do I trust more? Public Perception on AI-driven Mental health Interventions: A Survey research (Preprint)",
										created: "2024-10-01",
										abstract:
											"Artificial intelligence (AI) has become increasingly important in health care, generating both curiosity and concern. With a doctor-patient ratio of 1:834 in India, AI has the potential to alleviate a significant health care burden. Public perception plays a crucial role in shaping attitudes that can facilitate the adoption of new technologies. Similarly, the acceptance of AI-driven mental health interventions is crucial in determining their effectiveness and widespread adoption. Therefore, it is essential to study public perceptions and usage of existing AI-driven mental health interventions by exploring user experiences and opinions on their future applicability, particularly in comparison to traditional, human-based interventions.",
										features: [
											{
												id: "https://openalex.org/T11519",
												label: "Digital Mental Health",
												type: "topic",
												score: 0.9963,
											},
											{
												id: "https://openalex.org/T13283",
												label: "Network Analysis",
												type: "topic",
												score: 0.9811,
											},
											{
												id: "https://openalex.org/T12488",
												label: "Language Analysis",
												type: "topic",
												score: 0.97,
											},
											{
												id: "https://openalex.org/keywords/preprint",
												label: "Preprint",
												type: "keyword",
												score: 0.90048593,
											},
											{
												id: "https://openalex.org/C43169469",
												label: "Preprint",
												type: "concept",
												score: 0.90048593,
											},
											{
												id: "https://openalex.org/C27415008",
												label: "Psychological intervention",
												type: "concept",
												score: 0.6779285,
											},
											{
												id: "https://openalex.org/C134362201",
												label: "Mental health",
												type: "concept",
												score: 0.6705434,
											},
											{
												id: "https://openalex.org/C26760741",
												label: "Perception",
												type: "concept",
												score: 0.5866521,
											},
											{
												id: "https://openalex.org/C15744967",
												label: "Psychology",
												type: "concept",
												score: 0.5511217,
											},
											{
												id: "https://openalex.org/keywords/survey-research",
												label: "Survey research",
												type: "keyword",
												score: 0.49300477,
											},
											{
												id: "https://openalex.org/C173481278",
												label: "Survey research",
												type: "concept",
												score: 0.49300477,
											},
											{
												id: "https://openalex.org/C75630572",
												label: "Applied psychology",
												type: "concept",
												score: 0.3665211,
											},
											{
												id: "https://openalex.org/C17744445",
												label: "Political science",
												type: "concept",
												score: 0.32603627,
											},
											{
												id: "https://openalex.org/C118552586",
												label: "Psychiatry",
												type: "concept",
												score: 0.18042797,
											},
											{
												id: "https://openalex.org/C41008148",
												label: "Computer science",
												type: "concept",
												score: 0.17103863,
											},
											{
												id: "https://openalex.org/C136764020",
												label: "World Wide Web",
												type: "concept",
												score: 0.081232846,
											},
											{
												id: "https://openalex.org/C169760540",
												label: "Neuroscience",
												type: "concept",
												score: 0,
											},
										],
										authorships: [
											{
												author: {
													id: "https://openalex.org/A5003352074",
													display_name: "Mahima Anna Varghese",
													institution:
														"Vellore Institute of Technology University",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5005018481",
													display_name: "Poonam Sharma",
													institution:
														"Vellore Institute of Technology University",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5104973569",
													display_name: "Maitreyee Patwardhan",
													institution: "India Habitat Centre",
												},
											},
										],
										primary_location: {
											source: {
												display_name: "JMIR Formative Research",
												host_organization_name: null,
											},
											landing_page_url: "https://doi.org/10.2196/64380",
										},
										published: "2024-09-30",
									},
									{
										score: 0.6915806,
										id: "https://openalex.org/W4396642133",
										title:
											"The emergence of AI in mental health: A transformative journey",
										created: "2024-05-05",
										abstract:
											"This paper traces the evolution of Artificial Intelligence (AI) in psychiatry, from early attempts like the ELIZA program to the integration of neuroimaging studies and the emergence of digital interventions. Utilizing deep learning models, AI now demonstrates high accuracy in classifying psychiatric disorders, such as schizophrenia based on functional connectivity patterns. The rise of AI chat/therapy bots, exemplified by Woebot and Tess, addresses mental health challenges, providing accessible and effective cognitive behavioral therapy tools. Innovative interventions like avatar therapy and intelligent animal-like robots contribute to broadening therapeutic perspectives. While AI-based interventions offer advantages in reducing stigma and increasing accessibility, challenges including diagnostic accuracy, legal responsibilities, and privacy concerns must be carefully considered. Despite challenges, the significant potential of AI in psychiatry calls for large, controlled trials, national standards, and responsible integration into clinical practice. The convergence of AI and psychiatry represents a technological revolution poised to transform mental health care delivery globally.",
										features: [
											{
												id: "https://openalex.org/T11519",
												label: "Digital Mental Health",
												type: "topic",
												score: 0.9895,
											},
											{
												id: "https://openalex.org/T13283",
												label: "Network Analysis",
												type: "topic",
												score: 0.9756,
											},
											{
												id: "https://openalex.org/T11636",
												label: "AI in Medicine",
												type: "topic",
												score: 0.964,
											},
											{
												id: "https://openalex.org/keywords/transformative-learning",
												label: "Transformative learning",
												type: "keyword",
												score: 0.88830996,
											},
											{
												id: "https://openalex.org/C70587473",
												label: "Transformative learning",
												type: "concept",
												score: 0.88830996,
											},
											{
												id: "https://openalex.org/C134362201",
												label: "Mental health",
												type: "concept",
												score: 0.62350494,
											},
											{
												id: "https://openalex.org/C15744967",
												label: "Psychology",
												type: "concept",
												score: 0.5454548,
											},
											{
												id: "https://openalex.org/keywords/therapist-support",
												label: "Therapist Support",
												type: "keyword",
												score: 0.481358,
											},
											{
												id: "https://openalex.org/C11171543",
												label: "Psychoanalysis",
												type: "concept",
												score: 0.40033424,
											},
											{
												id: "https://openalex.org/C144024400",
												label: "Sociology",
												type: "concept",
												score: 0.33160913,
											},
											{
												id: "https://openalex.org/C542102704",
												label: "Psychotherapist",
												type: "concept",
												score: 0.27596053,
											},
											{
												id: "https://openalex.org/C138496976",
												label: "Developmental psychology",
												type: "concept",
												score: 0.21165526,
											},
										],
										authorships: [
											{
												author: {
													id: "https://openalex.org/A5095931546",
													display_name: "Vinod Kumar Dhiman",
													institution:
														"Deenbandhu Chhotu Ram University of Science and Technology",
												},
											},
										],
										primary_location: {
											source: {
												display_name:
													"World Journal of Advanced Research and Reviews",
												host_organization_name: "GSC Online Press",
											},
											landing_page_url:
												"https://doi.org/10.30574/wjarr.2024.22.1.1298",
										},
										published: "2024-04-30",
									},
									{
										score: 0.6869842,
										id: "https://openalex.org/W4391108112",
										title:
											"Considering AI-driven therapy: When does human empathy matter? (Preprint)",
										created: "2024-01-23",
										abstract:
											"<sec> <title>UNSTRUCTURED</title> Recent breakthroughs in artificial intelligence (AI) language models have elevated the vision of using conversational AI support for mental health, with a growing body of literature indicating varying degrees of efficacy. In this paper, we ask when, in therapy, it will be easier to replace humans and, conversely, in what instances, human connection will still be more valued. We suggest that empathy lies at the heart of the answer to this question. First, we define different aspects of empathy and outline the potential empathic capabilities of humans versus AI. Next, we consider what determines when these aspects are needed most in therapy, both from the perspective of therapeutic methodology and from the perspective of patient objectives. Ultimately, our goal is to prompt further investigation and dialogue, urging both practitioners and scholars engaged in AI-mediated therapy to keep these questions and considerations in mind when investigating AI implementation in mental health. </sec>",
										features: [
											{
												id: "https://openalex.org/T11519",
												label: "Digital Mental Health",
												type: "topic",
												score: 0.9999,
											},
											{
												id: "https://openalex.org/T13283",
												label: "Network Analysis",
												type: "topic",
												score: 0.9997,
											},
											{
												id: "https://openalex.org/T11093",
												label: "Borderline Disorder",
												type: "topic",
												score: 0.9962,
											},
											{
												id: "https://openalex.org/C2779885105",
												label: "Empathy",
												type: "concept",
												score: 0.9094653,
											},
											{
												id: "https://openalex.org/C12713177",
												label: "Perspective (graphical)",
												type: "concept",
												score: 0.77706486,
											},
											{
												id: "https://openalex.org/keywords/preprint",
												label: "Preprint",
												type: "keyword",
												score: 0.69605315,
											},
											{
												id: "https://openalex.org/C43169469",
												label: "Preprint",
												type: "concept",
												score: 0.69605315,
											},
											{
												id: "https://openalex.org/C15744967",
												label: "Psychology",
												type: "concept",
												score: 0.5121162,
											},
											{
												id: "https://openalex.org/keywords/therapist-support",
												label: "Therapist Support",
												type: "keyword",
												score: 0.50315,
											},
											{
												id: "https://openalex.org/C134362201",
												label: "Mental health",
												type: "concept",
												score: 0.44348887,
											},
											{
												id: "https://openalex.org/C188147891",
												label: "Cognitive science",
												type: "concept",
												score: 0.43078423,
											},
											{
												id: "https://openalex.org/C542102704",
												label: "Psychotherapist",
												type: "concept",
												score: 0.43013006,
											},
											{
												id: "https://openalex.org/C105409693",
												label: "Human intelligence",
												type: "concept",
												score: 0.42075717,
											},
											{
												id: "https://openalex.org/C111472728",
												label: "Epistemology",
												type: "concept",
												score: 0.34249896,
											},
											{
												id: "https://openalex.org/C41008148",
												label: "Computer science",
												type: "concept",
												score: 0.24293402,
											},
											{
												id: "https://openalex.org/C154945302",
												label: "Artificial intelligence",
												type: "concept",
												score: 0.24079987,
											},
											{
												id: "https://openalex.org/C77805123",
												label: "Social psychology",
												type: "concept",
												score: 0.1816862,
											},
											{
												id: "https://openalex.org/C138496976",
												label: "Developmental psychology",
												type: "concept",
												score: 0.09968531,
											},
											{
												id: "https://openalex.org/C138885662",
												label: "Philosophy",
												type: "concept",
												score: 0.07820511,
											},
											{
												id: "https://openalex.org/C136764020",
												label: "World Wide Web",
												type: "concept",
												score: 0,
											},
										],
										authorships: [
											{
												author: {
													id: "https://openalex.org/A5104285776",
													display_name: "Matan Rubin",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5093763070",
													display_name: "Hadar Arnon",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5042405428",
													display_name: "Jonathan D. Huppert",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5054907278",
													display_name: "Anat Perry",
												},
											},
										],
										primary_location: {
											source: {},
											landing_page_url:
												"https://doi.org/10.2196/preprints.56529",
										},
										published: "2024-01-18",
									},
									{
										score: 0.683903,
										id: "https://openalex.org/W4392354123",
										title:
											"Artificial Intelligence in nursing: trustworthy or reliable?",
										created: "2024-03-05",
										abstract:
											"Trustworthiness in Artificial Intelligence (AI) innovation is a priority for governments, researchers and clinicians; however, clinicians have highlighted trust and confidence as barriers to their acceptance of AI within a clinical application. While there is a call to design and develop AI that is considered trustworthy, AI still lacks the emotional capability to facilitate the reciprocal nature of trust.",
										features: [
											{
												id: "https://openalex.org/T11636",
												label: "AI in Medicine",
												type: "topic",
												score: 0.9993,
											},
											{
												id: "https://openalex.org/T10177",
												label: "Palliative Care",
												type: "topic",
												score: 0.9723,
											},
											{
												id: "https://openalex.org/T10416",
												label: "Brain Injury",
												type: "topic",
												score: 0.9492,
											},
											{
												id: "https://openalex.org/keywords/trustworthiness",
												label: "Trustworthiness",
												type: "keyword",
												score: 0.924162,
											},
											{
												id: "https://openalex.org/C153701036",
												label: "Trustworthiness",
												type: "concept",
												score: 0.924162,
											},
											{
												id: "https://openalex.org/keywords/reciprocal",
												label: "Reciprocal",
												type: "keyword",
												score: 0.5832353,
											},
											{
												id: "https://openalex.org/C2777742833",
												label: "Reciprocal",
												type: "concept",
												score: 0.5832353,
											},
											{
												id: "https://openalex.org/C15744967",
												label: "Psychology",
												type: "concept",
												score: 0.48273486,
											},
											{
												id: "https://openalex.org/C159110408",
												label: "Nursing",
												type: "concept",
												score: 0.45881423,
											},
											{
												id: "https://openalex.org/keywords/artificial-intelligences",
												label: "Artificial Intelligences",
												type: "keyword",
												score: 0.446357,
											},
											{
												id: "https://openalex.org/C41008148",
												label: "Computer science",
												type: "concept",
												score: 0.42549077,
											},
											{
												id: "https://openalex.org/C56739046",
												label: "Knowledge management",
												type: "concept",
												score: 0.42530334,
											},
											{
												id: "https://openalex.org/C154945302",
												label: "Artificial intelligence",
												type: "concept",
												score: 0.33646774,
											},
											{
												id: "https://openalex.org/C71924100",
												label: "Medicine",
												type: "concept",
												score: 0.3072965,
											},
											{
												id: "https://openalex.org/C77805123",
												label: "Social psychology",
												type: "concept",
												score: 0.2274571,
											},
											{
												id: "https://openalex.org/C41895202",
												label: "Linguistics",
												type: "concept",
												score: 0,
											},
											{
												id: "https://openalex.org/C138885662",
												label: "Philosophy",
												type: "concept",
												score: 0,
											},
										],
										authorships: [
											{
												author: {
													id: "https://openalex.org/A5076828804",
													display_name: "Oliver Higgins",
													institution: "University of Newcastle Australia",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5054614441",
													display_name: "Stephan K. Chalup",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5029316442",
													display_name: "Rhonda Wilson",
													institution: "Gosford Hospital",
												},
											},
										],
										primary_location: {
											source: {
												display_name: "Journal of research in nursing",
												host_organization_name: "SAGE Publishing",
											},
											landing_page_url:
												"https://doi.org/10.1177/17449871231215696",
										},
										published: "2024-02-29",
									},
									{
										score: 0.68323505,
										id: "https://openalex.org/W4403962195",
										title:
											"Can AI replace psychotherapists? Exploring the future of mental health care",
										created: "2024-11-01",
										abstract:
											"against the growing prevalence of mental health issues (7,8).AI's role in mental health care is multifaceted, encompassing predictive analytics, therapeutic interventions, clinician support tools, and patient monitoring systems (9). For instance, AI algorithms are increasingly used to predict treatment outcomes by analyzing patient data (10). Meanwhile, AI-powered interventions, such as virtual reality exposure therapy and chatbot-delivered cognitive behavioral therapy, are being explored, though they are at varying stages of validation (11,12). Each of these applications is evolving at its own pace, influenced by technological advancements and the need for rigorous clinical validation.AI's capabilities in handling extensive datasets and analyzing complex behavioral patterns position it as a revolutionary force capable of transforming mental health care by offering advanced detection methods, personalized treatment plans, and virtual therapeutic platforms that could dramatically increase accessibility, reduce stigma, and enhance treatment outcomes (13,14,15,4).Furthermore, the role of AI in mental health extends to potentially replacing certain functions traditionally performed by human psychotherapists. Innovations in machine learning and natural language processing have enabled AI systems like ChatGPT to recognize and process complex human emotions, facilitating interactions that once required the nuanced understanding of trained therapists (16,17). Preliminary studies suggest that AI-powered chatbots may help alleviate symptoms of anxiety and depression (18,19). However, these studies often involve small participant groups and lack long-term follow-up, making it difficult to draw definitive conclusions about their effectiveness. Consequently, while AI interventions hold promise, further research through large-scale, randomized controlled trials is necessary to establish their efficacy and sustainability over time.Studies have shown that AI-powered chatbots can effectively reduce symptoms of anxiety and depression, offering a level of interaction that suggests machines might soon match or even surpass human capabilities in certain aspects of psychotherapy (18,19,20,21).Although these studies indicate short-term benefits, meta-analyses have shown that these effects may not be sustained in the long term, with no significant changes observed over extended periods (22).As AI continues to evolve and become more deeply integrated into the mental healthcare sector, its potential to fundamentally transform the field is undeniable. At a time when mental health issues have reached pandemic proportions globally, affecting productivity and quality of life (23,24), the need for innovative solutions is urgent.",
										features: [
											{
												id: "https://openalex.org/T10272",
												label: "Stigma Impact",
												type: "topic",
												score: 0.9982,
											},
											{
												id: "https://openalex.org/T11519",
												label: "Digital Mental Health",
												type: "topic",
												score: 0.9967,
											},
											{
												id: "https://openalex.org/T12308",
												label: "Health Philosophy",
												type: "topic",
												score: 0.9904,
											},
											{
												id: "https://openalex.org/C134362201",
												label: "Mental health",
												type: "concept",
												score: 0.6167934,
											},
											{
												id: "https://openalex.org/C15744967",
												label: "Psychology",
												type: "concept",
												score: 0.6096347,
											},
											{
												id: "https://openalex.org/keywords/mental-health-care",
												label: "Mental Health Care",
												type: "keyword",
												score: 0.5092696,
											},
											{
												id: "https://openalex.org/C2992545881",
												label: "Mental health care",
												type: "concept",
												score: 0.5092696,
											},
											{
												id: "https://openalex.org/C542102704",
												label: "Psychotherapist",
												type: "concept",
												score: 0.42161185,
											},
										],
										authorships: [
											{
												author: {
													id: "https://openalex.org/A5100451619",
													display_name: "Zhihui Zhang",
													institution: "Universitat Politècnica de Catalunya",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5100378370",
													display_name: "Jing Wang",
													institution: "Shenzhen Second People's Hospital",
												},
											},
										],
										primary_location: {
											source: {
												display_name: "Frontiers in Psychiatry",
												host_organization_name: "Frontiers Media",
											},
											landing_page_url:
												"https://doi.org/10.3389/fpsyt.2024.1444382",
										},
										published: "2024-10-31",
									},
									{
										score: 0.68091685,
										id: "https://openalex.org/W4395055188",
										title:
											"Considering the Role of Human Empathy in AI-Driven Therapy",
										created: "2024-04-24",
										abstract:
											"Recent breakthroughs in artificial intelligence (AI) language models have elevated the vision of using conversational AI support for mental health, with a growing body of literature indicating varying degrees of efficacy. In this paper, we ask when, in therapy, it will be easier to replace humans and, conversely, in what instances, human connection will still be more valued. We suggest that empathy lies at the heart of the answer to this question. First, we define different aspects of empathy and outline the potential empathic capabilities of humans versus AI. Next, we consider what determines when these aspects are needed most in therapy, both from the perspective of therapeutic methodology and from the perspective of patient objectives. Ultimately, our goal is to prompt further investigation and dialogue, urging both practitioners and scholars engaged in AI-mediated therapy to keep these questions and considerations in mind when investigating AI implementation in mental health.",
										features: [
											{
												id: "https://openalex.org/T11519",
												label: "Digital Mental Health",
												type: "topic",
												score: 0.9991,
											},
											{
												id: "https://openalex.org/T13283",
												label: "Network Analysis",
												type: "topic",
												score: 0.9971,
											},
											{
												id: "https://openalex.org/T12308",
												label: "Health Philosophy",
												type: "topic",
												score: 0.9834,
											},
											{
												id: "https://openalex.org/C2779885105",
												label: "Empathy",
												type: "concept",
												score: 0.57700056,
											},
											{
												id: "https://openalex.org/keywords/therapist-support",
												label: "Therapist Support",
												type: "keyword",
												score: 0.569166,
											},
											{
												id: "https://openalex.org/keywords/cognitive-behavioral-therapy",
												label: "Cognitive-Behavioral Therapy",
												type: "keyword",
												score: 0.565075,
											},
											{
												id: "https://openalex.org/keywords/temporal-experience",
												label: "Temporal Experience",
												type: "keyword",
												score: 0.553337,
											},
											{
												id: "https://openalex.org/C542102704",
												label: "Psychotherapist",
												type: "concept",
												score: 0.53896755,
											},
											{
												id: "https://openalex.org/keywords/person-centered-medicine",
												label: "Person-Centered Medicine",
												type: "keyword",
												score: 0.535963,
											},
											{
												id: "https://openalex.org/keywords/psychometric-models",
												label: "Psychometric Models",
												type: "keyword",
												score: 0.526327,
											},
											{
												id: "https://openalex.org/C15744967",
												label: "Psychology",
												type: "concept",
												score: 0.51501226,
											},
											{
												id: "https://openalex.org/C71924100",
												label: "Medicine",
												type: "concept",
												score: 0.3424691,
											},
											{
												id: "https://openalex.org/C118552586",
												label: "Psychiatry",
												type: "concept",
												score: 0.1826179,
											},
										],
										authorships: [
											{
												author: {
													id: "https://openalex.org/A5104285776",
													display_name: "Matan Rubin",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5093763070",
													display_name: "Hadar Arnon",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5042405428",
													display_name: "Jonathan D. Huppert",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5054907278",
													display_name: "Anat Perry",
												},
											},
										],
										primary_location: {
											source: {
												display_name: "JMIR Mental Health",
												host_organization_name: "JMIR Publications",
											},
											landing_page_url: "https://doi.org/10.2196/56529",
										},
										published: "2024-04-23",
									},
									{
										score: 0.67765296,
										id: "https://openalex.org/W4396974499",
										title:
											"(Why) Do We Trust AI?: A Case of AI-based Health Chatbots",
										created: "2024-05-17",
										abstract:
											"Automated chatbots powered by artificial intelligence (AI) can act as a ubiquitous point of contact, improving access to healthcare and empowering users to make effective decisions. However, despite the potential benefits, emerging literature suggests that apprehensions linked to the distinctive features of AI technology and the specific context of use (healthcare) could undermine consumer trust and hinder widespread adoption. Although the role of trust is considered pivotal to the acceptance of healthcare technologies, a dearth of research exists that focuses on the contextual factors that drive trust in such AI-based Chatbots for Self-Diagnosis (AICSD). Accordingly, a contextual model based on the trust-in-technology framework was developed to understand the determinants of consumers’ trust in AICSD and its behavioral consequences. It was validated using a free simulation experiment study in India (N = 202). Perceived anthropomorphism, perceived information quality, perceived explainability, disposition to trust technology, and perceived service quality influence consumers’ trust in AICSD. In turn, trust, privacy risk, health risk, and gender determine the intention to use. The research contributes by developing and validating a context-specific model for explaining trust in AICSD that could aid developers and marketers in enhancing consumers’ trust in and adoption of AICSD.",
										features: [
											{
												id: "https://openalex.org/T11519",
												label: "Digital Mental Health",
												type: "topic",
												score: 0.8863,
											},
											{
												id: "https://openalex.org/T10883",
												label: "AI Ethics",
												type: "topic",
												score: 0.8856,
											},
											{
												id: "https://openalex.org/T12128",
												label: "AI in Service",
												type: "topic",
												score: 0.8854,
											},
											{
												id: "https://openalex.org/keywords/chatbots",
												label: "Chatbots",
												type: "keyword",
												score: 0.620733,
											},
											{
												id: "https://openalex.org/keywords/human-robot-interaction",
												label: "Human-Robot Interaction",
												type: "keyword",
												score: 0.509968,
											},
											{
												id: "https://openalex.org/keywords/artificial-intelligences",
												label: "Artificial Intelligences",
												type: "keyword",
												score: 0.502468,
											},
											{
												id: "https://openalex.org/C15744967",
												label: "Psychology",
												type: "concept",
												score: 0.4361616,
											},
											{
												id: "https://openalex.org/C41008148",
												label: "Computer science",
												type: "concept",
												score: 0.39939684,
											},
											{
												id: "https://openalex.org/C154945302",
												label: "Artificial intelligence",
												type: "concept",
												score: 0.37931553,
											},
										],
										authorships: [
											{
												author: {
													id: "https://openalex.org/A5084138407",
													display_name: "Ashish Viswanath Prakash",
													institution:
														"Indian Institute of Management Tiruchirappalli",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5048474556",
													display_name: "Saini Das",
													institution:
														"Indian Institute of Technology Kharagpur",
												},
											},
										],
										primary_location: {
											source: {
												display_name:
													"AJIS. Australasian journal of information systems/AJIS. Australian journal of information systems/Australian journal of information systems",
												host_organization_name:
													"Australasian Association for Information Systems",
											},
											landing_page_url: "https://doi.org/10.3127/ajis.v28.4235",
										},
										published: "2024-05-15",
									},
								],
							},
						},
					],
				},
			],
		},
	},
	{
		stepType: "tool-result",
		text: "Trust in AI for therapy is mixed. While AI can enhance therapy accessibility and effectiveness, concerns about empathy and human connection remain [1]. Some studies show AI chatbots can match human therapists in quality, but trust issues persist due to AI's lack of emotional understanding [2]. Public perception and acceptance are crucial for AI's success in mental health interventions [3].",
		toolCalls: [],
		toolResults: [],
		finishReason: "stop",
		usage: {
			promptTokens: 8723,
			completionTokens: 74,
			totalTokens: 8797,
		},
		warnings: [],
		request: {
			body: '{"model":"gpt-4o","temperature":0,"messages":[{"role":"system","content":"\\nYou are a helpful high school teacher that provides conclusive answers to user questions, based on research papers provided by the `getPapers` tool, and supplementing the information in research papers with your general knowledge.\\n\\nWhenever a user ask a question, you should always use the `getPapers` tool and base your answer on the most relevant research papers from the `getPapers` result set. \\n\\nOnly if not relevant research is found, are you allowed to answer base on your general knowledge. And is these cases, you should start your reply by stating that no relevant research was found.\\n\\nRules:\\n- Your answer should not exceed 60 words.\\n- Your answer should use layman\'s terminology, not scientific jargon.\\n- Do not repeat the user\'s question in your answer.\\n- Answers should be short and concise: two or three sentences that reference facts and findings from the research papers. \\n- Try to reference at least three papers in every answer.\\n- Use numerical references to the research papers using brackets: [1], [2], etc.\\n- Do not include a reference list in your ouytput. The user will already have the list.\\n- Do not start your answer with \\"Based on the research papers...\\" or similar. Just start with your answer without any introduction.\\n\\nStep 1: Determine if an answer to the user question may supported by research.\\nStep 2: Use the `getPapers` tool to find the most relevant research papers.\\nStep 3: Review the research papers retrieved and determine which papers to reference in the answer.\\nStep 4: Construct a short and concise answer in two or three sentences based on facts and findings from the research papers.\\n"},{"role":"user","content":"Is online therapy effective?"},{"role":"assistant","content":"Online therapy is generally effective, offering accessibility and convenience [1]. Online Cognitive Behavioral Therapy (CBT) shows significant improvements in depression [2]. However, challenges like reduced nonverbal communication and technical issues can affect its effectiveness [3]. Despite these challenges, online therapy remains a viable option, especially when combined with in-person sessions [4]., with interactive elements"},{"role":"user","content":"Why is this important"},{"role":"assistant","content":"Online therapy is important because it increases accessibility to mental health services, especially for those in remote areas or with mobility issues [1]. It also reduces barriers like stigma and cost, making therapy more inclusive [2]. During the COVID-19 pandemic, it provided a crucial alternative to in-person sessions, ensuring continuity of care [3]., with interactive elements"},{"role":"user","content":"tell me more"},{"role":"assistant","content":"Online therapy is crucial for its accessibility, reducing barriers like stigma and cost [1]. It offers flexibility and convenience, especially during crises like the COVID-19 pandemic [2]. Despite challenges like reduced nonverbal communication, it remains a valuable tool, often complementing in-person therapy [3]., with interactive elements"},{"role":"user","content":"but what now?"},{"role":"assistant","content":"Online therapy continues to be a significant mode of mental health care, especially post-COVID-19. It offers accessibility and convenience, though challenges like nonverbal communication and confidentiality persist [1]. Therapists and clients have adapted, finding online therapy effective, especially when combined with in-person sessions [2]. Training for therapists in digital skills is crucial for maximizing its benefits [3]., with interactive elements"},{"role":"user","content":"where is it heading"},{"role":"assistant","content":"The future of online therapy is promising, with increased integration of digital technologies like AI and virtual reality to enhance therapeutic experiences [1]. The demand for online mental health services is growing, driven by accessibility and convenience [2]. However, challenges like ensuring confidentiality and improving digital competencies remain [3]. Training and adaptation are crucial for maximizing its potential [4]., with interactive elements"},{"role":"user","content":"will clients trust AI"},{"role":"assistant","content":"","tool_calls":[{"id":"call_7KO4SnMWL4paRTbOoI3b88uW","type":"function","function":{"name":"searchPapers","arguments":"{\\"query\\":\\"trust in AI for therapy\\"}"}}]},{"role":"tool","tool_call_id":"call_7KO4SnMWL4paRTbOoI3b88uW","content":"{\\"papers\\":[{\\"score\\":0.71408415,\\"id\\":\\"https://openalex.org/W4394978403\\",\\"title\\":\\"Artificial intelligence and psychotherapy: A counterpoint\\",\\"created\\":\\"2024-04-21\\",\\"abstract\\":\\"Abstract Psychotherapy practice is a human endeavour. Research on the specific and non‐specific factors of treatment has helped crystallise its relevance and clinical impact. The challenges currently faced by the field revolve around ensuring access to evidence‐based treatments and enhancing their effectiveness. Digitally delivered formats of empirically supported treatments increase access while supporting the relevance of the treatment‐specific ingredients and the necessity for human guidance. Excitement surrounds the potential integration of novel artificial intelligence (AI) machine learning methods to advance psychotherapy effectiveness. The abundance of data in digitally delivered formats positions them well to harness the capabilities of AI. Recent work provides proof of concept in areas including detection and diagnosis, predicting outcomes, treatment adherence, remission and relapse. A potential risk emerges when applying machine learning methods, in which an overreliance on AI inferences may overshadow the human aspect of psychotherapy. The contrast is simple: we may over‐invest in the rationality and relevance of our AI inferences, blindly obeying the algorithmic counsel that may lead to unintended consequences, such as oversimplifying human complexity. This would amount to changing psychotherapy from a human‐centric to a techno‐centric endeavour, something we should steadily avoid. This perspective highlights the importance of balancing enthusiasm for AI advancements with a cautious approach. The discussion outlines the risks associated with overdependence on AI and provides reasons to avoid a scenario in which psychotherapy loses its human essence. In conclusion, the perspective suggests avenues for future research to prevent such a transformation and maintain the human‐centric nature of psychotherapy.\\",\\"features\\":[{\\"id\\":\\"https://openalex.org/T11519\\",\\"label\\":\\"Digital Mental Health\\",\\"type\\":\\"topic\\",\\"score\\":0.9997},{\\"id\\":\\"https://openalex.org/T13283\\",\\"label\\":\\"Network Analysis\\",\\"type\\":\\"topic\\",\\"score\\":0.9996},{\\"id\\":\\"https://openalex.org/T11093\\",\\"label\\":\\"Borderline Disorder\\",\\"type\\":\\"topic\\",\\"score\\":0.9916},{\\"id\\":\\"https://openalex.org/keywords/counterpoint\\",\\"label\\":\\"Counterpoint\\",\\"type\\":\\"keyword\\",\\"score\\":0.9064764},{\\"id\\":\\"https://openalex.org/C12582419\\",\\"label\\":\\"Counterpoint\\",\\"type\\":\\"concept\\",\\"score\\":0.9064764},{\\"id\\":\\"https://openalex.org/C15744967\\",\\"label\\":\\"Psychology\\",\\"type\\":\\"concept\\",\\"score\\":0.7240945},{\\"id\\":\\"https://openalex.org/C542102704\\",\\"label\\":\\"Psychotherapist\\",\\"type\\":\\"concept\\",\\"score\\":0.6172853},{\\"id\\":\\"https://openalex.org/keywords/psychometric-models\\",\\"label\\":\\"Psychometric Models\\",\\"type\\":\\"keyword\\",\\"score\\":0.576167},{\\"id\\":\\"https://openalex.org/keywords/cognitive-behavioral-therapy\\",\\"label\\":\\"Cognitive-Behavioral Therapy\\",\\"type\\":\\"keyword\\",\\"score\\":0.563445},{\\"id\\":\\"https://openalex.org/keywords/mentalization-based-treatment\\",\\"label\\":\\"Mentalization-Based Treatment\\",\\"type\\":\\"keyword\\",\\"score\\":0.560809},{\\"id\\":\\"https://openalex.org/keywords/dialectical-behavior-therapy\\",\\"label\\":\\"Dialectical Behavior Therapy\\",\\"type\\":\\"keyword\\",\\"score\\":0.548986},{\\"id\\":\\"https://openalex.org/keywords/psychopathology\\",\\"label\\":\\"Psychopathology\\",\\"type\\":\\"keyword\\",\\"score\\":0.542048},{\\"id\\":\\"https://openalex.org/C11171543\\",\\"label\\":\\"Psychoanalysis\\",\\"type\\":\\"concept\\",\\"score\\":0.4844718},{\\"id\\":\\"https://openalex.org/C19417346\\",\\"label\\":\\"Pedagogy\\",\\"type\\":\\"concept\\",\\"score\\":0}],\\"authorships\\":[{\\"author\\":{\\"id\\":\\"https://openalex.org/A5065326687\\",\\"display_name\\":\\"Derek Richards\\",\\"institution\\":\\"Trinity College Dublin\\"}}],\\"primary_location\\":{\\"source\\":{\\"display_name\\":\\"Counselling and Psychotherapy Research\\",\\"host_organization_name\\":\\"Wiley\\"},\\"landing_page_url\\":\\"https://doi.org/10.1002/capr.12758\\"},\\"published\\":\\"2024-04-19\\"},{\\"score\\":0.71203005,\\"id\\":\\"https://openalex.org/W4399356273\\",\\"title\\":\\"Applications of AI in Psychotherapy: An Innovative Tool\\",\\"created\\":\\"2024-06-06\\",\\"abstract\\":\\"This paper explores the application and potential of artificial intelligence (AI) in psychological therapy as well as its implications for Chinese psychotherapy firm \\\\\\"JianDanXinLi\\\\\\" or otherwise known as SimpleTherapy. Through an analysis of several AI psychological therapy service platforms, it reveals the principles of integrating AI into modern psychotherapy and demonstrates that AI technology can serve as a flexible alternative and supplementary means for optimizing data in the therapeutic process. Although AI technology cannot fully replace human services, it can significantly expand and enhance the scope and effectiveness of therapy. Additionally, this paper discusses the challenges faced by AI technology in integrating psychological therapy, especially regarding issues of empathy.\\",\\"features\\":[{\\"id\\":\\"https://openalex.org/T11519\\",\\"label\\":\\"Digital Mental Health\\",\\"type\\":\\"topic\\",\\"score\\":0.8391},{\\"id\\":\\"https://openalex.org/T13283\\",\\"label\\":\\"Network Analysis\\",\\"type\\":\\"topic\\",\\"score\\":0.7213},{\\"id\\":\\"https://openalex.org/C542102704\\",\\"label\\":\\"Psychotherapist\\",\\"type\\":\\"concept\\",\\"score\\":0.6074601},{\\"id\\":\\"https://openalex.org/keywords/psychometric-models\\",\\"label\\":\\"Psychometric Models\\",\\"type\\":\\"keyword\\",\\"score\\":0.56655},{\\"id\\":\\"https://openalex.org/keywords/psychopathology\\",\\"label\\":\\"Psychopathology\\",\\"type\\":\\"keyword\\",\\"score\\":0.54114},{\\"id\\":\\"https://openalex.org/keywords/cognitive-behavioral-therapy\\",\\"label\\":\\"Cognitive-Behavioral Therapy\\",\\"type\\":\\"keyword\\",\\"score\\":0.539232},{\\"id\\":\\"https://openalex.org/keywords/therapist-support\\",\\"label\\":\\"Therapist Support\\",\\"type\\":\\"keyword\\",\\"score\\":0.523834},{\\"id\\":\\"https://openalex.org/keywords/internet-based-interventions\\",\\"label\\":\\"Internet-based Interventions\\",\\"type\\":\\"keyword\\",\\"score\\":0.523644},{\\"id\\":\\"https://openalex.org/C15744967\\",\\"label\\":\\"Psychology\\",\\"type\\":\\"concept\\",\\"score\\":0.4413297},{\\"id\\":\\"https://openalex.org/C188147891\\",\\"label\\":\\"Cognitive science\\",\\"type\\":\\"concept\\",\\"score\\":0.3596448}],\\"authorships\\":[{\\"author\\":{\\"id\\":\\"https://openalex.org/A5102682288\\",\\"display_name\\":\\"Johnny Shanglin Du\\",\\"institution\\":\\"United World College of South East Asia\\"}}],\\"primary_location\\":{\\"source\\":{\\"display_name\\":\\"Cambridge Science Advance\\",\\"host_organization_name\\":null},\\"landing_page_url\\":\\"https://doi.org/10.62852/csa/2024/8\\"},\\"published\\":\\"2024-06-05\\"},{\\"score\\":0.7103702,\\"id\\":\\"https://openalex.org/W4401648069\\",\\"title\\":\\"Human-Human vs Human-AI Therapy: An Empirical Study\\",\\"created\\":\\"2024-08-17\\",\\"abstract\\":\\"In many nations, demand for mental health services currently outstrips supply, especially in the area of talk-based psychological interventions. Within this context, chatbots (software applications designed to simulate conversations with human users) are increasingly explored as potential adjuncts to traditional mental healthcare service delivery with a view to improving accessibility and reducing waiting times. However, the effectiveness and acceptability of such chatbots remains under-researched. This study evaluates mental health professionals\' perceptions of Pi, a relational Artificial Intelligence (AI) chatbot, in the early stages of the psychotherapeutic process (problem exploration). We asked 63 therapists to assess therapy transcripts between a human client and Pi (human-AI) versus traditional therapy transcripts between therapists and clients (human-human). Therapists were unable to reliably discriminate between human-AI and human-human therapy transcripts. Therapists were accurate only 53.9% of the time, no better than chance, and rated the human-AI transcripts as higher quality on average. This study has potentially profound implications for the treatment of mental health problems, adding tentative support for the use of relational AI chatbots in providing initial assistance for mild to moderate psychological issues, especially when access to human therapists is constrained.\\",\\"features\\":[{\\"id\\":\\"https://openalex.org/T11519\\",\\"label\\":\\"Digital Mental Health\\",\\"type\\":\\"topic\\",\\"score\\":0.9969},{\\"id\\":\\"https://openalex.org/T12128\\",\\"label\\":\\"AI in Service\\",\\"type\\":\\"topic\\",\\"score\\":0.9938},{\\"id\\":\\"https://openalex.org/T10883\\",\\"label\\":\\"AI Ethics\\",\\"type\\":\\"topic\\",\\"score\\":0.9676},{\\"id\\":\\"https://openalex.org/keywords/human-robot-interaction\\",\\"label\\":\\"Human-Robot Interaction\\",\\"type\\":\\"keyword\\",\\"score\\":0.562569},{\\"id\\":\\"https://openalex.org/keywords/cognitive-behavioral-therapy\\",\\"label\\":\\"Cognitive-Behavioral Therapy\\",\\"type\\":\\"keyword\\",\\"score\\":0.538043},{\\"id\\":\\"https://openalex.org/keywords/therapist-support\\",\\"label\\":\\"Therapist Support\\",\\"type\\":\\"keyword\\",\\"score\\":0.521105},{\\"id\\":\\"https://openalex.org/keywords/voice-assistants\\",\\"label\\":\\"Voice Assistants\\",\\"type\\":\\"keyword\\",\\"score\\":0.5017},{\\"id\\":\\"https://openalex.org/keywords/behavioral-activation\\",\\"label\\":\\"Behavioral Activation\\",\\"type\\":\\"keyword\\",\\"score\\":0.50022},{\\"id\\":\\"https://openalex.org/C15744967\\",\\"label\\":\\"Psychology\\",\\"type\\":\\"concept\\",\\"score\\":0.38499185}],\\"authorships\\":[{\\"author\\":{\\"id\\":\\"https://openalex.org/A5048209907\\",\\"display_name\\":\\"Mohammad Amin Kuhail\\",\\"institution\\":\\"Zayed University\\"}},{\\"author\\":{\\"id\\":\\"https://openalex.org/A5020838797\\",\\"display_name\\":\\"Nazik Alturki\\",\\"institution\\":\\"Princess Nourah bint Abdulrahman University\\"}},{\\"author\\":{\\"id\\":\\"https://openalex.org/A5101089824\\",\\"display_name\\":\\"Justin Thomas\\"}},{\\"author\\":{\\"id\\":\\"https://openalex.org/A5010155161\\",\\"display_name\\":\\"Amal Khalifa Alkhalifa\\",\\"institution\\":\\"Princess Nourah bint Abdulrahman University\\"}},{\\"author\\":{\\"id\\":\\"https://openalex.org/A5076202343\\",\\"display_name\\":\\"Amal Alshardan\\",\\"institution\\":\\"Princess Nourah bint Abdulrahman University\\"}}],\\"primary_location\\":{\\"source\\":{\\"display_name\\":\\"International Journal of Human-Computer Interaction\\",\\"host_organization_name\\":\\"Taylor & Francis\\"},\\"landing_page_url\\":\\"https://doi.org/10.1080/10447318.2024.2385001\\"},\\"published\\":\\"2024-08-16\\"},{\\"score\\":0.69300854,\\"id\\":\\"https://openalex.org/W4403004333\\",\\"title\\":\\"Who do I trust more? Public Perception on AI-driven Mental health Interventions: A Survey research (Preprint)\\",\\"created\\":\\"2024-10-01\\",\\"abstract\\":\\"Artificial intelligence (AI) has become increasingly important in health care, generating both curiosity and concern. With a doctor-patient ratio of 1:834 in India, AI has the potential to alleviate a significant health care burden. Public perception plays a crucial role in shaping attitudes that can facilitate the adoption of new technologies. Similarly, the acceptance of AI-driven mental health interventions is crucial in determining their effectiveness and widespread adoption. Therefore, it is essential to study public perceptions and usage of existing AI-driven mental health interventions by exploring user experiences and opinions on their future applicability, particularly in comparison to traditional, human-based interventions.\\",\\"features\\":[{\\"id\\":\\"https://openalex.org/T11519\\",\\"label\\":\\"Digital Mental Health\\",\\"type\\":\\"topic\\",\\"score\\":0.9963},{\\"id\\":\\"https://openalex.org/T13283\\",\\"label\\":\\"Network Analysis\\",\\"type\\":\\"topic\\",\\"score\\":0.9811},{\\"id\\":\\"https://openalex.org/T12488\\",\\"label\\":\\"Language Analysis\\",\\"type\\":\\"topic\\",\\"score\\":0.97},{\\"id\\":\\"https://openalex.org/keywords/preprint\\",\\"label\\":\\"Preprint\\",\\"type\\":\\"keyword\\",\\"score\\":0.90048593},{\\"id\\":\\"https://openalex.org/C43169469\\",\\"label\\":\\"Preprint\\",\\"type\\":\\"concept\\",\\"score\\":0.90048593},{\\"id\\":\\"https://openalex.org/C27415008\\",\\"label\\":\\"Psychological intervention\\",\\"type\\":\\"concept\\",\\"score\\":0.6779285},{\\"id\\":\\"https://openalex.org/C134362201\\",\\"label\\":\\"Mental health\\",\\"type\\":\\"concept\\",\\"score\\":0.6705434},{\\"id\\":\\"https://openalex.org/C26760741\\",\\"label\\":\\"Perception\\",\\"type\\":\\"concept\\",\\"score\\":0.5866521},{\\"id\\":\\"https://openalex.org/C15744967\\",\\"label\\":\\"Psychology\\",\\"type\\":\\"concept\\",\\"score\\":0.5511217},{\\"id\\":\\"https://openalex.org/keywords/survey-research\\",\\"label\\":\\"Survey research\\",\\"type\\":\\"keyword\\",\\"score\\":0.49300477},{\\"id\\":\\"https://openalex.org/C173481278\\",\\"label\\":\\"Survey research\\",\\"type\\":\\"concept\\",\\"score\\":0.49300477},{\\"id\\":\\"https://openalex.org/C75630572\\",\\"label\\":\\"Applied psychology\\",\\"type\\":\\"concept\\",\\"score\\":0.3665211},{\\"id\\":\\"https://openalex.org/C17744445\\",\\"label\\":\\"Political science\\",\\"type\\":\\"concept\\",\\"score\\":0.32603627},{\\"id\\":\\"https://openalex.org/C118552586\\",\\"label\\":\\"Psychiatry\\",\\"type\\":\\"concept\\",\\"score\\":0.18042797},{\\"id\\":\\"https://openalex.org/C41008148\\",\\"label\\":\\"Computer science\\",\\"type\\":\\"concept\\",\\"score\\":0.17103863},{\\"id\\":\\"https://openalex.org/C136764020\\",\\"label\\":\\"World Wide Web\\",\\"type\\":\\"concept\\",\\"score\\":0.081232846},{\\"id\\":\\"https://openalex.org/C169760540\\",\\"label\\":\\"Neuroscience\\",\\"type\\":\\"concept\\",\\"score\\":0}],\\"authorships\\":[{\\"author\\":{\\"id\\":\\"https://openalex.org/A5003352074\\",\\"display_name\\":\\"Mahima Anna Varghese\\",\\"institution\\":\\"Vellore Institute of Technology University\\"}},{\\"author\\":{\\"id\\":\\"https://openalex.org/A5005018481\\",\\"display_name\\":\\"Poonam Sharma\\",\\"institution\\":\\"Vellore Institute of Technology University\\"}},{\\"author\\":{\\"id\\":\\"https://openalex.org/A5104973569\\",\\"display_name\\":\\"Maitreyee Patwardhan\\",\\"institution\\":\\"India Habitat Centre\\"}}],\\"primary_location\\":{\\"source\\":{\\"display_name\\":\\"JMIR Formative Research\\",\\"host_organization_name\\":null},\\"landing_page_url\\":\\"https://doi.org/10.2196/64380\\"},\\"published\\":\\"2024-09-30\\"},{\\"score\\":0.6915806,\\"id\\":\\"https://openalex.org/W4396642133\\",\\"title\\":\\"The emergence of AI in mental health: A transformative journey\\",\\"created\\":\\"2024-05-05\\",\\"abstract\\":\\"This paper traces the evolution of Artificial Intelligence (AI) in psychiatry, from early attempts like the ELIZA program to the integration of neuroimaging studies and the emergence of digital interventions. Utilizing deep learning models, AI now demonstrates high accuracy in classifying psychiatric disorders, such as schizophrenia based on functional connectivity patterns. The rise of AI chat/therapy bots, exemplified by Woebot and Tess, addresses mental health challenges, providing accessible and effective cognitive behavioral therapy tools. Innovative interventions like avatar therapy and intelligent animal-like robots contribute to broadening therapeutic perspectives. While AI-based interventions offer advantages in reducing stigma and increasing accessibility, challenges including diagnostic accuracy, legal responsibilities, and privacy concerns must be carefully considered. Despite challenges, the significant potential of AI in psychiatry calls for large, controlled trials, national standards, and responsible integration into clinical practice. The convergence of AI and psychiatry represents a technological revolution poised to transform mental health care delivery globally.\\",\\"features\\":[{\\"id\\":\\"https://openalex.org/T11519\\",\\"label\\":\\"Digital Mental Health\\",\\"type\\":\\"topic\\",\\"score\\":0.9895},{\\"id\\":\\"https://openalex.org/T13283\\",\\"label\\":\\"Network Analysis\\",\\"type\\":\\"topic\\",\\"score\\":0.9756},{\\"id\\":\\"https://openalex.org/T11636\\",\\"label\\":\\"AI in Medicine\\",\\"type\\":\\"topic\\",\\"score\\":0.964},{\\"id\\":\\"https://openalex.org/keywords/transformative-learning\\",\\"label\\":\\"Transformative learning\\",\\"type\\":\\"keyword\\",\\"score\\":0.88830996},{\\"id\\":\\"https://openalex.org/C70587473\\",\\"label\\":\\"Transformative learning\\",\\"type\\":\\"concept\\",\\"score\\":0.88830996},{\\"id\\":\\"https://openalex.org/C134362201\\",\\"label\\":\\"Mental health\\",\\"type\\":\\"concept\\",\\"score\\":0.62350494},{\\"id\\":\\"https://openalex.org/C15744967\\",\\"label\\":\\"Psychology\\",\\"type\\":\\"concept\\",\\"score\\":0.5454548},{\\"id\\":\\"https://openalex.org/keywords/therapist-support\\",\\"label\\":\\"Therapist Support\\",\\"type\\":\\"keyword\\",\\"score\\":0.481358},{\\"id\\":\\"https://openalex.org/C11171543\\",\\"label\\":\\"Psychoanalysis\\",\\"type\\":\\"concept\\",\\"score\\":0.40033424},{\\"id\\":\\"https://openalex.org/C144024400\\",\\"label\\":\\"Sociology\\",\\"type\\":\\"concept\\",\\"score\\":0.33160913},{\\"id\\":\\"https://openalex.org/C542102704\\",\\"label\\":\\"Psychotherapist\\",\\"type\\":\\"concept\\",\\"score\\":0.27596053},{\\"id\\":\\"https://openalex.org/C138496976\\",\\"label\\":\\"Developmental psychology\\",\\"type\\":\\"concept\\",\\"score\\":0.21165526}],\\"authorships\\":[{\\"author\\":{\\"id\\":\\"https://openalex.org/A5095931546\\",\\"display_name\\":\\"Vinod Kumar Dhiman\\",\\"institution\\":\\"Deenbandhu Chhotu Ram University of Science and Technology\\"}}],\\"primary_location\\":{\\"source\\":{\\"display_name\\":\\"World Journal of Advanced Research and Reviews\\",\\"host_organization_name\\":\\"GSC Online Press\\"},\\"landing_page_url\\":\\"https://doi.org/10.30574/wjarr.2024.22.1.1298\\"},\\"published\\":\\"2024-04-30\\"},{\\"score\\":0.6869842,\\"id\\":\\"https://openalex.org/W4391108112\\",\\"title\\":\\"Considering AI-driven therapy: When does human empathy matter? (Preprint)\\",\\"created\\":\\"2024-01-23\\",\\"abstract\\":\\"<sec> <title>UNSTRUCTURED</title> Recent breakthroughs in artificial intelligence (AI) language models have elevated the vision of using conversational AI support for mental health, with a growing body of literature indicating varying degrees of efficacy. In this paper, we ask when, in therapy, it will be easier to replace humans and, conversely, in what instances, human connection will still be more valued. We suggest that empathy lies at the heart of the answer to this question. First, we define different aspects of empathy and outline the potential empathic capabilities of humans versus AI. Next, we consider what determines when these aspects are needed most in therapy, both from the perspective of therapeutic methodology and from the perspective of patient objectives. Ultimately, our goal is to prompt further investigation and dialogue, urging both practitioners and scholars engaged in AI-mediated therapy to keep these questions and considerations in mind when investigating AI implementation in mental health. </sec>\\",\\"features\\":[{\\"id\\":\\"https://openalex.org/T11519\\",\\"label\\":\\"Digital Mental Health\\",\\"type\\":\\"topic\\",\\"score\\":0.9999},{\\"id\\":\\"https://openalex.org/T13283\\",\\"label\\":\\"Network Analysis\\",\\"type\\":\\"topic\\",\\"score\\":0.9997},{\\"id\\":\\"https://openalex.org/T11093\\",\\"label\\":\\"Borderline Disorder\\",\\"type\\":\\"topic\\",\\"score\\":0.9962},{\\"id\\":\\"https://openalex.org/C2779885105\\",\\"label\\":\\"Empathy\\",\\"type\\":\\"concept\\",\\"score\\":0.9094653},{\\"id\\":\\"https://openalex.org/C12713177\\",\\"label\\":\\"Perspective (graphical)\\",\\"type\\":\\"concept\\",\\"score\\":0.77706486},{\\"id\\":\\"https://openalex.org/keywords/preprint\\",\\"label\\":\\"Preprint\\",\\"type\\":\\"keyword\\",\\"score\\":0.69605315},{\\"id\\":\\"https://openalex.org/C43169469\\",\\"label\\":\\"Preprint\\",\\"type\\":\\"concept\\",\\"score\\":0.69605315},{\\"id\\":\\"https://openalex.org/C15744967\\",\\"label\\":\\"Psychology\\",\\"type\\":\\"concept\\",\\"score\\":0.5121162},{\\"id\\":\\"https://openalex.org/keywords/therapist-support\\",\\"label\\":\\"Therapist Support\\",\\"type\\":\\"keyword\\",\\"score\\":0.50315},{\\"id\\":\\"https://openalex.org/C134362201\\",\\"label\\":\\"Mental health\\",\\"type\\":\\"concept\\",\\"score\\":0.44348887},{\\"id\\":\\"https://openalex.org/C188147891\\",\\"label\\":\\"Cognitive science\\",\\"type\\":\\"concept\\",\\"score\\":0.43078423},{\\"id\\":\\"https://openalex.org/C542102704\\",\\"label\\":\\"Psychotherapist\\",\\"type\\":\\"concept\\",\\"score\\":0.43013006},{\\"id\\":\\"https://openalex.org/C105409693\\",\\"label\\":\\"Human intelligence\\",\\"type\\":\\"concept\\",\\"score\\":0.42075717},{\\"id\\":\\"https://openalex.org/C111472728\\",\\"label\\":\\"Epistemology\\",\\"type\\":\\"concept\\",\\"score\\":0.34249896},{\\"id\\":\\"https://openalex.org/C41008148\\",\\"label\\":\\"Computer science\\",\\"type\\":\\"concept\\",\\"score\\":0.24293402},{\\"id\\":\\"https://openalex.org/C154945302\\",\\"label\\":\\"Artificial intelligence\\",\\"type\\":\\"concept\\",\\"score\\":0.24079987},{\\"id\\":\\"https://openalex.org/C77805123\\",\\"label\\":\\"Social psychology\\",\\"type\\":\\"concept\\",\\"score\\":0.1816862},{\\"id\\":\\"https://openalex.org/C138496976\\",\\"label\\":\\"Developmental psychology\\",\\"type\\":\\"concept\\",\\"score\\":0.09968531},{\\"id\\":\\"https://openalex.org/C138885662\\",\\"label\\":\\"Philosophy\\",\\"type\\":\\"concept\\",\\"score\\":0.07820511},{\\"id\\":\\"https://openalex.org/C136764020\\",\\"label\\":\\"World Wide Web\\",\\"type\\":\\"concept\\",\\"score\\":0}],\\"authorships\\":[{\\"author\\":{\\"id\\":\\"https://openalex.org/A5104285776\\",\\"display_name\\":\\"Matan Rubin\\"}},{\\"author\\":{\\"id\\":\\"https://openalex.org/A5093763070\\",\\"display_name\\":\\"Hadar Arnon\\"}},{\\"author\\":{\\"id\\":\\"https://openalex.org/A5042405428\\",\\"display_name\\":\\"Jonathan D. Huppert\\"}},{\\"author\\":{\\"id\\":\\"https://openalex.org/A5054907278\\",\\"display_name\\":\\"Anat Perry\\"}}],\\"primary_location\\":{\\"source\\":{},\\"landing_page_url\\":\\"https://doi.org/10.2196/preprints.56529\\"},\\"published\\":\\"2024-01-18\\"},{\\"score\\":0.683903,\\"id\\":\\"https://openalex.org/W4392354123\\",\\"title\\":\\"Artificial Intelligence in nursing: trustworthy or reliable?\\",\\"created\\":\\"2024-03-05\\",\\"abstract\\":\\"Trustworthiness in Artificial Intelligence (AI) innovation is a priority for governments, researchers and clinicians; however, clinicians have highlighted trust and confidence as barriers to their acceptance of AI within a clinical application. While there is a call to design and develop AI that is considered trustworthy, AI still lacks the emotional capability to facilitate the reciprocal nature of trust.\\",\\"features\\":[{\\"id\\":\\"https://openalex.org/T11636\\",\\"label\\":\\"AI in Medicine\\",\\"type\\":\\"topic\\",\\"score\\":0.9993},{\\"id\\":\\"https://openalex.org/T10177\\",\\"label\\":\\"Palliative Care\\",\\"type\\":\\"topic\\",\\"score\\":0.9723},{\\"id\\":\\"https://openalex.org/T10416\\",\\"label\\":\\"Brain Injury\\",\\"type\\":\\"topic\\",\\"score\\":0.9492},{\\"id\\":\\"https://openalex.org/keywords/trustworthiness\\",\\"label\\":\\"Trustworthiness\\",\\"type\\":\\"keyword\\",\\"score\\":0.924162},{\\"id\\":\\"https://openalex.org/C153701036\\",\\"label\\":\\"Trustworthiness\\",\\"type\\":\\"concept\\",\\"score\\":0.924162},{\\"id\\":\\"https://openalex.org/keywords/reciprocal\\",\\"label\\":\\"Reciprocal\\",\\"type\\":\\"keyword\\",\\"score\\":0.5832353},{\\"id\\":\\"https://openalex.org/C2777742833\\",\\"label\\":\\"Reciprocal\\",\\"type\\":\\"concept\\",\\"score\\":0.5832353},{\\"id\\":\\"https://openalex.org/C15744967\\",\\"label\\":\\"Psychology\\",\\"type\\":\\"concept\\",\\"score\\":0.48273486},{\\"id\\":\\"https://openalex.org/C159110408\\",\\"label\\":\\"Nursing\\",\\"type\\":\\"concept\\",\\"score\\":0.45881423},{\\"id\\":\\"https://openalex.org/keywords/artificial-intelligences\\",\\"label\\":\\"Artificial Intelligences\\",\\"type\\":\\"keyword\\",\\"score\\":0.446357},{\\"id\\":\\"https://openalex.org/C41008148\\",\\"label\\":\\"Computer science\\",\\"type\\":\\"concept\\",\\"score\\":0.42549077},{\\"id\\":\\"https://openalex.org/C56739046\\",\\"label\\":\\"Knowledge management\\",\\"type\\":\\"concept\\",\\"score\\":0.42530334},{\\"id\\":\\"https://openalex.org/C154945302\\",\\"label\\":\\"Artificial intelligence\\",\\"type\\":\\"concept\\",\\"score\\":0.33646774},{\\"id\\":\\"https://openalex.org/C71924100\\",\\"label\\":\\"Medicine\\",\\"type\\":\\"concept\\",\\"score\\":0.3072965},{\\"id\\":\\"https://openalex.org/C77805123\\",\\"label\\":\\"Social psychology\\",\\"type\\":\\"concept\\",\\"score\\":0.2274571},{\\"id\\":\\"https://openalex.org/C41895202\\",\\"label\\":\\"Linguistics\\",\\"type\\":\\"concept\\",\\"score\\":0},{\\"id\\":\\"https://openalex.org/C138885662\\",\\"label\\":\\"Philosophy\\",\\"type\\":\\"concept\\",\\"score\\":0}],\\"authorships\\":[{\\"author\\":{\\"id\\":\\"https://openalex.org/A5076828804\\",\\"display_name\\":\\"Oliver Higgins\\",\\"institution\\":\\"University of Newcastle Australia\\"}},{\\"author\\":{\\"id\\":\\"https://openalex.org/A5054614441\\",\\"display_name\\":\\"Stephan K. Chalup\\"}},{\\"author\\":{\\"id\\":\\"https://openalex.org/A5029316442\\",\\"display_name\\":\\"Rhonda Wilson\\",\\"institution\\":\\"Gosford Hospital\\"}}],\\"primary_location\\":{\\"source\\":{\\"display_name\\":\\"Journal of research in nursing\\",\\"host_organization_name\\":\\"SAGE Publishing\\"},\\"landing_page_url\\":\\"https://doi.org/10.1177/17449871231215696\\"},\\"published\\":\\"2024-02-29\\"},{\\"score\\":0.68323505,\\"id\\":\\"https://openalex.org/W4403962195\\",\\"title\\":\\"Can AI replace psychotherapists? Exploring the future of mental health care\\",\\"created\\":\\"2024-11-01\\",\\"abstract\\":\\"against the growing prevalence of mental health issues (7,8).AI\'s role in mental health care is multifaceted, encompassing predictive analytics, therapeutic interventions, clinician support tools, and patient monitoring systems (9). For instance, AI algorithms are increasingly used to predict treatment outcomes by analyzing patient data (10). Meanwhile, AI-powered interventions, such as virtual reality exposure therapy and chatbot-delivered cognitive behavioral therapy, are being explored, though they are at varying stages of validation (11,12). Each of these applications is evolving at its own pace, influenced by technological advancements and the need for rigorous clinical validation.AI\'s capabilities in handling extensive datasets and analyzing complex behavioral patterns position it as a revolutionary force capable of transforming mental health care by offering advanced detection methods, personalized treatment plans, and virtual therapeutic platforms that could dramatically increase accessibility, reduce stigma, and enhance treatment outcomes (13,14,15,4).Furthermore, the role of AI in mental health extends to potentially replacing certain functions traditionally performed by human psychotherapists. Innovations in machine learning and natural language processing have enabled AI systems like ChatGPT to recognize and process complex human emotions, facilitating interactions that once required the nuanced understanding of trained therapists (16,17). Preliminary studies suggest that AI-powered chatbots may help alleviate symptoms of anxiety and depression (18,19). However, these studies often involve small participant groups and lack long-term follow-up, making it difficult to draw definitive conclusions about their effectiveness. Consequently, while AI interventions hold promise, further research through large-scale, randomized controlled trials is necessary to establish their efficacy and sustainability over time.Studies have shown that AI-powered chatbots can effectively reduce symptoms of anxiety and depression, offering a level of interaction that suggests machines might soon match or even surpass human capabilities in certain aspects of psychotherapy (18,19,20,21).Although these studies indicate short-term benefits, meta-analyses have shown that these effects may not be sustained in the long term, with no significant changes observed over extended periods (22).As AI continues to evolve and become more deeply integrated into the mental healthcare sector, its potential to fundamentally transform the field is undeniable. At a time when mental health issues have reached pandemic proportions globally, affecting productivity and quality of life (23,24), the need for innovative solutions is urgent.\\",\\"features\\":[{\\"id\\":\\"https://openalex.org/T10272\\",\\"label\\":\\"Stigma Impact\\",\\"type\\":\\"topic\\",\\"score\\":0.9982},{\\"id\\":\\"https://openalex.org/T11519\\",\\"label\\":\\"Digital Mental Health\\",\\"type\\":\\"topic\\",\\"score\\":0.9967},{\\"id\\":\\"https://openalex.org/T12308\\",\\"label\\":\\"Health Philosophy\\",\\"type\\":\\"topic\\",\\"score\\":0.9904},{\\"id\\":\\"https://openalex.org/C134362201\\",\\"label\\":\\"Mental health\\",\\"type\\":\\"concept\\",\\"score\\":0.6167934},{\\"id\\":\\"https://openalex.org/C15744967\\",\\"label\\":\\"Psychology\\",\\"type\\":\\"concept\\",\\"score\\":0.6096347},{\\"id\\":\\"https://openalex.org/keywords/mental-health-care\\",\\"label\\":\\"Mental Health Care\\",\\"type\\":\\"keyword\\",\\"score\\":0.5092696},{\\"id\\":\\"https://openalex.org/C2992545881\\",\\"label\\":\\"Mental health care\\",\\"type\\":\\"concept\\",\\"score\\":0.5092696},{\\"id\\":\\"https://openalex.org/C542102704\\",\\"label\\":\\"Psychotherapist\\",\\"type\\":\\"concept\\",\\"score\\":0.42161185}],\\"authorships\\":[{\\"author\\":{\\"id\\":\\"https://openalex.org/A5100451619\\",\\"display_name\\":\\"Zhihui Zhang\\",\\"institution\\":\\"Universitat Politècnica de Catalunya\\"}},{\\"author\\":{\\"id\\":\\"https://openalex.org/A5100378370\\",\\"display_name\\":\\"Jing Wang\\",\\"institution\\":\\"Shenzhen Second People\'s Hospital\\"}}],\\"primary_location\\":{\\"source\\":{\\"display_name\\":\\"Frontiers in Psychiatry\\",\\"host_organization_name\\":\\"Frontiers Media\\"},\\"landing_page_url\\":\\"https://doi.org/10.3389/fpsyt.2024.1444382\\"},\\"published\\":\\"2024-10-31\\"},{\\"score\\":0.68091685,\\"id\\":\\"https://openalex.org/W4395055188\\",\\"title\\":\\"Considering the Role of Human Empathy in AI-Driven Therapy\\",\\"created\\":\\"2024-04-24\\",\\"abstract\\":\\"Recent breakthroughs in artificial intelligence (AI) language models have elevated the vision of using conversational AI support for mental health, with a growing body of literature indicating varying degrees of efficacy. In this paper, we ask when, in therapy, it will be easier to replace humans and, conversely, in what instances, human connection will still be more valued. We suggest that empathy lies at the heart of the answer to this question. First, we define different aspects of empathy and outline the potential empathic capabilities of humans versus AI. Next, we consider what determines when these aspects are needed most in therapy, both from the perspective of therapeutic methodology and from the perspective of patient objectives. Ultimately, our goal is to prompt further investigation and dialogue, urging both practitioners and scholars engaged in AI-mediated therapy to keep these questions and considerations in mind when investigating AI implementation in mental health.\\",\\"features\\":[{\\"id\\":\\"https://openalex.org/T11519\\",\\"label\\":\\"Digital Mental Health\\",\\"type\\":\\"topic\\",\\"score\\":0.9991},{\\"id\\":\\"https://openalex.org/T13283\\",\\"label\\":\\"Network Analysis\\",\\"type\\":\\"topic\\",\\"score\\":0.9971},{\\"id\\":\\"https://openalex.org/T12308\\",\\"label\\":\\"Health Philosophy\\",\\"type\\":\\"topic\\",\\"score\\":0.9834},{\\"id\\":\\"https://openalex.org/C2779885105\\",\\"label\\":\\"Empathy\\",\\"type\\":\\"concept\\",\\"score\\":0.57700056},{\\"id\\":\\"https://openalex.org/keywords/therapist-support\\",\\"label\\":\\"Therapist Support\\",\\"type\\":\\"keyword\\",\\"score\\":0.569166},{\\"id\\":\\"https://openalex.org/keywords/cognitive-behavioral-therapy\\",\\"label\\":\\"Cognitive-Behavioral Therapy\\",\\"type\\":\\"keyword\\",\\"score\\":0.565075},{\\"id\\":\\"https://openalex.org/keywords/temporal-experience\\",\\"label\\":\\"Temporal Experience\\",\\"type\\":\\"keyword\\",\\"score\\":0.553337},{\\"id\\":\\"https://openalex.org/C542102704\\",\\"label\\":\\"Psychotherapist\\",\\"type\\":\\"concept\\",\\"score\\":0.53896755},{\\"id\\":\\"https://openalex.org/keywords/person-centered-medicine\\",\\"label\\":\\"Person-Centered Medicine\\",\\"type\\":\\"keyword\\",\\"score\\":0.535963},{\\"id\\":\\"https://openalex.org/keywords/psychometric-models\\",\\"label\\":\\"Psychometric Models\\",\\"type\\":\\"keyword\\",\\"score\\":0.526327},{\\"id\\":\\"https://openalex.org/C15744967\\",\\"label\\":\\"Psychology\\",\\"type\\":\\"concept\\",\\"score\\":0.51501226},{\\"id\\":\\"https://openalex.org/C71924100\\",\\"label\\":\\"Medicine\\",\\"type\\":\\"concept\\",\\"score\\":0.3424691},{\\"id\\":\\"https://openalex.org/C118552586\\",\\"label\\":\\"Psychiatry\\",\\"type\\":\\"concept\\",\\"score\\":0.1826179}],\\"authorships\\":[{\\"author\\":{\\"id\\":\\"https://openalex.org/A5104285776\\",\\"display_name\\":\\"Matan Rubin\\"}},{\\"author\\":{\\"id\\":\\"https://openalex.org/A5093763070\\",\\"display_name\\":\\"Hadar Arnon\\"}},{\\"author\\":{\\"id\\":\\"https://openalex.org/A5042405428\\",\\"display_name\\":\\"Jonathan D. Huppert\\"}},{\\"author\\":{\\"id\\":\\"https://openalex.org/A5054907278\\",\\"display_name\\":\\"Anat Perry\\"}}],\\"primary_location\\":{\\"source\\":{\\"display_name\\":\\"JMIR Mental Health\\",\\"host_organization_name\\":\\"JMIR Publications\\"},\\"landing_page_url\\":\\"https://doi.org/10.2196/56529\\"},\\"published\\":\\"2024-04-23\\"},{\\"score\\":0.67765296,\\"id\\":\\"https://openalex.org/W4396974499\\",\\"title\\":\\"(Why) Do We Trust AI?: A Case of AI-based Health Chatbots\\",\\"created\\":\\"2024-05-17\\",\\"abstract\\":\\"Automated chatbots powered by artificial intelligence (AI) can act as a ubiquitous point of contact, improving access to healthcare and empowering users to make effective decisions. However, despite the potential benefits, emerging literature suggests that apprehensions linked to the distinctive features of AI technology and the specific context of use (healthcare) could undermine consumer trust and hinder widespread adoption. Although the role of trust is considered pivotal to the acceptance of healthcare technologies, a dearth of research exists that focuses on the contextual factors that drive trust in such AI-based Chatbots for Self-Diagnosis (AICSD). Accordingly, a contextual model based on the trust-in-technology framework was developed to understand the determinants of consumers’ trust in AICSD and its behavioral consequences. It was validated using a free simulation experiment study in India (N = 202). Perceived anthropomorphism, perceived information quality, perceived explainability, disposition to trust technology, and perceived service quality influence consumers’ trust in AICSD. In turn, trust, privacy risk, health risk, and gender determine the intention to use. The research contributes by developing and validating a context-specific model for explaining trust in AICSD that could aid developers and marketers in enhancing consumers’ trust in and adoption of AICSD.\\",\\"features\\":[{\\"id\\":\\"https://openalex.org/T11519\\",\\"label\\":\\"Digital Mental Health\\",\\"type\\":\\"topic\\",\\"score\\":0.8863},{\\"id\\":\\"https://openalex.org/T10883\\",\\"label\\":\\"AI Ethics\\",\\"type\\":\\"topic\\",\\"score\\":0.8856},{\\"id\\":\\"https://openalex.org/T12128\\",\\"label\\":\\"AI in Service\\",\\"type\\":\\"topic\\",\\"score\\":0.8854},{\\"id\\":\\"https://openalex.org/keywords/chatbots\\",\\"label\\":\\"Chatbots\\",\\"type\\":\\"keyword\\",\\"score\\":0.620733},{\\"id\\":\\"https://openalex.org/keywords/human-robot-interaction\\",\\"label\\":\\"Human-Robot Interaction\\",\\"type\\":\\"keyword\\",\\"score\\":0.509968},{\\"id\\":\\"https://openalex.org/keywords/artificial-intelligences\\",\\"label\\":\\"Artificial Intelligences\\",\\"type\\":\\"keyword\\",\\"score\\":0.502468},{\\"id\\":\\"https://openalex.org/C15744967\\",\\"label\\":\\"Psychology\\",\\"type\\":\\"concept\\",\\"score\\":0.4361616},{\\"id\\":\\"https://openalex.org/C41008148\\",\\"label\\":\\"Computer science\\",\\"type\\":\\"concept\\",\\"score\\":0.39939684},{\\"id\\":\\"https://openalex.org/C154945302\\",\\"label\\":\\"Artificial intelligence\\",\\"type\\":\\"concept\\",\\"score\\":0.37931553}],\\"authorships\\":[{\\"author\\":{\\"id\\":\\"https://openalex.org/A5084138407\\",\\"display_name\\":\\"Ashish Viswanath Prakash\\",\\"institution\\":\\"Indian Institute of Management Tiruchirappalli\\"}},{\\"author\\":{\\"id\\":\\"https://openalex.org/A5048474556\\",\\"display_name\\":\\"Saini Das\\",\\"institution\\":\\"Indian Institute of Technology Kharagpur\\"}}],\\"primary_location\\":{\\"source\\":{\\"display_name\\":\\"AJIS. Australasian journal of information systems/AJIS. Australian journal of information systems/Australian journal of information systems\\",\\"host_organization_name\\":\\"Australasian Association for Information Systems\\"},\\"landing_page_url\\":\\"https://doi.org/10.3127/ajis.v28.4235\\"},\\"published\\":\\"2024-05-15\\"}]}"}],"tools":[{"type":"function","function":{"name":"searchPapers","description":"Find specific research papers matching a user query","parameters":{"type":"object","properties":{"query":{"type":"string","description":"The search query"}},"required":["query"],"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"}}}],"tool_choice":"auto"}',
		},
		response: {
			id: "chatcmpl-B0RQFdJOnvgjc0jqeKjqxGXKPIQg8",
			timestamp: new Date("2025-02-13T11:11:51.000Z"),
			modelId: "gpt-4o-2024-08-06",
			messages: [
				{
					role: "assistant",
					content: [
						{ type: "text", text: "" },
						{
							type: "tool-call",
							toolCallId: "call_7KO4SnMWL4paRTbOoI3b88uW",
							toolName: "searchPapers",
							args: { query: "trust in AI for therapy" },
						},
					],
				},
				{
					role: "tool",
					content: [
						{
							type: "tool-result",
							toolCallId: "call_7KO4SnMWL4paRTbOoI3b88uW",
							toolName: "searchPapers",
							result: {
								papers: [
									{
										score: 0.71408415,
										id: "https://openalex.org/W4394978403",
										title:
											"Artificial intelligence and psychotherapy: A counterpoint",
										created: "2024-04-21",
										abstract:
											"Abstract Psychotherapy practice is a human endeavour. Research on the specific and non‐specific factors of treatment has helped crystallise its relevance and clinical impact. The challenges currently faced by the field revolve around ensuring access to evidence‐based treatments and enhancing their effectiveness. Digitally delivered formats of empirically supported treatments increase access while supporting the relevance of the treatment‐specific ingredients and the necessity for human guidance. Excitement surrounds the potential integration of novel artificial intelligence (AI) machine learning methods to advance psychotherapy effectiveness. The abundance of data in digitally delivered formats positions them well to harness the capabilities of AI. Recent work provides proof of concept in areas including detection and diagnosis, predicting outcomes, treatment adherence, remission and relapse. A potential risk emerges when applying machine learning methods, in which an overreliance on AI inferences may overshadow the human aspect of psychotherapy. The contrast is simple: we may over‐invest in the rationality and relevance of our AI inferences, blindly obeying the algorithmic counsel that may lead to unintended consequences, such as oversimplifying human complexity. This would amount to changing psychotherapy from a human‐centric to a techno‐centric endeavour, something we should steadily avoid. This perspective highlights the importance of balancing enthusiasm for AI advancements with a cautious approach. The discussion outlines the risks associated with overdependence on AI and provides reasons to avoid a scenario in which psychotherapy loses its human essence. In conclusion, the perspective suggests avenues for future research to prevent such a transformation and maintain the human‐centric nature of psychotherapy.",
										features: [
											{
												id: "https://openalex.org/T11519",
												label: "Digital Mental Health",
												type: "topic",
												score: 0.9997,
											},
											{
												id: "https://openalex.org/T13283",
												label: "Network Analysis",
												type: "topic",
												score: 0.9996,
											},
											{
												id: "https://openalex.org/T11093",
												label: "Borderline Disorder",
												type: "topic",
												score: 0.9916,
											},
											{
												id: "https://openalex.org/keywords/counterpoint",
												label: "Counterpoint",
												type: "keyword",
												score: 0.9064764,
											},
											{
												id: "https://openalex.org/C12582419",
												label: "Counterpoint",
												type: "concept",
												score: 0.9064764,
											},
											{
												id: "https://openalex.org/C15744967",
												label: "Psychology",
												type: "concept",
												score: 0.7240945,
											},
											{
												id: "https://openalex.org/C542102704",
												label: "Psychotherapist",
												type: "concept",
												score: 0.6172853,
											},
											{
												id: "https://openalex.org/keywords/psychometric-models",
												label: "Psychometric Models",
												type: "keyword",
												score: 0.576167,
											},
											{
												id: "https://openalex.org/keywords/cognitive-behavioral-therapy",
												label: "Cognitive-Behavioral Therapy",
												type: "keyword",
												score: 0.563445,
											},
											{
												id: "https://openalex.org/keywords/mentalization-based-treatment",
												label: "Mentalization-Based Treatment",
												type: "keyword",
												score: 0.560809,
											},
											{
												id: "https://openalex.org/keywords/dialectical-behavior-therapy",
												label: "Dialectical Behavior Therapy",
												type: "keyword",
												score: 0.548986,
											},
											{
												id: "https://openalex.org/keywords/psychopathology",
												label: "Psychopathology",
												type: "keyword",
												score: 0.542048,
											},
											{
												id: "https://openalex.org/C11171543",
												label: "Psychoanalysis",
												type: "concept",
												score: 0.4844718,
											},
											{
												id: "https://openalex.org/C19417346",
												label: "Pedagogy",
												type: "concept",
												score: 0,
											},
										],
										authorships: [
											{
												author: {
													id: "https://openalex.org/A5065326687",
													display_name: "Derek Richards",
													institution: "Trinity College Dublin",
												},
											},
										],
										primary_location: {
											source: {
												display_name: "Counselling and Psychotherapy Research",
												host_organization_name: "Wiley",
											},
											landing_page_url: "https://doi.org/10.1002/capr.12758",
										},
										published: "2024-04-19",
									},
									{
										score: 0.71203005,
										id: "https://openalex.org/W4399356273",
										title:
											"Applications of AI in Psychotherapy: An Innovative Tool",
										created: "2024-06-06",
										abstract:
											'This paper explores the application and potential of artificial intelligence (AI) in psychological therapy as well as its implications for Chinese psychotherapy firm "JianDanXinLi" or otherwise known as SimpleTherapy. Through an analysis of several AI psychological therapy service platforms, it reveals the principles of integrating AI into modern psychotherapy and demonstrates that AI technology can serve as a flexible alternative and supplementary means for optimizing data in the therapeutic process. Although AI technology cannot fully replace human services, it can significantly expand and enhance the scope and effectiveness of therapy. Additionally, this paper discusses the challenges faced by AI technology in integrating psychological therapy, especially regarding issues of empathy.',
										features: [
											{
												id: "https://openalex.org/T11519",
												label: "Digital Mental Health",
												type: "topic",
												score: 0.8391,
											},
											{
												id: "https://openalex.org/T13283",
												label: "Network Analysis",
												type: "topic",
												score: 0.7213,
											},
											{
												id: "https://openalex.org/C542102704",
												label: "Psychotherapist",
												type: "concept",
												score: 0.6074601,
											},
											{
												id: "https://openalex.org/keywords/psychometric-models",
												label: "Psychometric Models",
												type: "keyword",
												score: 0.56655,
											},
											{
												id: "https://openalex.org/keywords/psychopathology",
												label: "Psychopathology",
												type: "keyword",
												score: 0.54114,
											},
											{
												id: "https://openalex.org/keywords/cognitive-behavioral-therapy",
												label: "Cognitive-Behavioral Therapy",
												type: "keyword",
												score: 0.539232,
											},
											{
												id: "https://openalex.org/keywords/therapist-support",
												label: "Therapist Support",
												type: "keyword",
												score: 0.523834,
											},
											{
												id: "https://openalex.org/keywords/internet-based-interventions",
												label: "Internet-based Interventions",
												type: "keyword",
												score: 0.523644,
											},
											{
												id: "https://openalex.org/C15744967",
												label: "Psychology",
												type: "concept",
												score: 0.4413297,
											},
											{
												id: "https://openalex.org/C188147891",
												label: "Cognitive science",
												type: "concept",
												score: 0.3596448,
											},
										],
										authorships: [
											{
												author: {
													id: "https://openalex.org/A5102682288",
													display_name: "Johnny Shanglin Du",
													institution:
														"United World College of South East Asia",
												},
											},
										],
										primary_location: {
											source: {
												display_name: "Cambridge Science Advance",
												host_organization_name: null,
											},
											landing_page_url: "https://doi.org/10.62852/csa/2024/8",
										},
										published: "2024-06-05",
									},
									{
										score: 0.7103702,
										id: "https://openalex.org/W4401648069",
										title:
											"Human-Human vs Human-AI Therapy: An Empirical Study",
										created: "2024-08-17",
										abstract:
											"In many nations, demand for mental health services currently outstrips supply, especially in the area of talk-based psychological interventions. Within this context, chatbots (software applications designed to simulate conversations with human users) are increasingly explored as potential adjuncts to traditional mental healthcare service delivery with a view to improving accessibility and reducing waiting times. However, the effectiveness and acceptability of such chatbots remains under-researched. This study evaluates mental health professionals' perceptions of Pi, a relational Artificial Intelligence (AI) chatbot, in the early stages of the psychotherapeutic process (problem exploration). We asked 63 therapists to assess therapy transcripts between a human client and Pi (human-AI) versus traditional therapy transcripts between therapists and clients (human-human). Therapists were unable to reliably discriminate between human-AI and human-human therapy transcripts. Therapists were accurate only 53.9% of the time, no better than chance, and rated the human-AI transcripts as higher quality on average. This study has potentially profound implications for the treatment of mental health problems, adding tentative support for the use of relational AI chatbots in providing initial assistance for mild to moderate psychological issues, especially when access to human therapists is constrained.",
										features: [
											{
												id: "https://openalex.org/T11519",
												label: "Digital Mental Health",
												type: "topic",
												score: 0.9969,
											},
											{
												id: "https://openalex.org/T12128",
												label: "AI in Service",
												type: "topic",
												score: 0.9938,
											},
											{
												id: "https://openalex.org/T10883",
												label: "AI Ethics",
												type: "topic",
												score: 0.9676,
											},
											{
												id: "https://openalex.org/keywords/human-robot-interaction",
												label: "Human-Robot Interaction",
												type: "keyword",
												score: 0.562569,
											},
											{
												id: "https://openalex.org/keywords/cognitive-behavioral-therapy",
												label: "Cognitive-Behavioral Therapy",
												type: "keyword",
												score: 0.538043,
											},
											{
												id: "https://openalex.org/keywords/therapist-support",
												label: "Therapist Support",
												type: "keyword",
												score: 0.521105,
											},
											{
												id: "https://openalex.org/keywords/voice-assistants",
												label: "Voice Assistants",
												type: "keyword",
												score: 0.5017,
											},
											{
												id: "https://openalex.org/keywords/behavioral-activation",
												label: "Behavioral Activation",
												type: "keyword",
												score: 0.50022,
											},
											{
												id: "https://openalex.org/C15744967",
												label: "Psychology",
												type: "concept",
												score: 0.38499185,
											},
										],
										authorships: [
											{
												author: {
													id: "https://openalex.org/A5048209907",
													display_name: "Mohammad Amin Kuhail",
													institution: "Zayed University",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5020838797",
													display_name: "Nazik Alturki",
													institution:
														"Princess Nourah bint Abdulrahman University",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5101089824",
													display_name: "Justin Thomas",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5010155161",
													display_name: "Amal Khalifa Alkhalifa",
													institution:
														"Princess Nourah bint Abdulrahman University",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5076202343",
													display_name: "Amal Alshardan",
													institution:
														"Princess Nourah bint Abdulrahman University",
												},
											},
										],
										primary_location: {
											source: {
												display_name:
													"International Journal of Human-Computer Interaction",
												host_organization_name: "Taylor & Francis",
											},
											landing_page_url:
												"https://doi.org/10.1080/10447318.2024.2385001",
										},
										published: "2024-08-16",
									},
									{
										score: 0.69300854,
										id: "https://openalex.org/W4403004333",
										title:
											"Who do I trust more? Public Perception on AI-driven Mental health Interventions: A Survey research (Preprint)",
										created: "2024-10-01",
										abstract:
											"Artificial intelligence (AI) has become increasingly important in health care, generating both curiosity and concern. With a doctor-patient ratio of 1:834 in India, AI has the potential to alleviate a significant health care burden. Public perception plays a crucial role in shaping attitudes that can facilitate the adoption of new technologies. Similarly, the acceptance of AI-driven mental health interventions is crucial in determining their effectiveness and widespread adoption. Therefore, it is essential to study public perceptions and usage of existing AI-driven mental health interventions by exploring user experiences and opinions on their future applicability, particularly in comparison to traditional, human-based interventions.",
										features: [
											{
												id: "https://openalex.org/T11519",
												label: "Digital Mental Health",
												type: "topic",
												score: 0.9963,
											},
											{
												id: "https://openalex.org/T13283",
												label: "Network Analysis",
												type: "topic",
												score: 0.9811,
											},
											{
												id: "https://openalex.org/T12488",
												label: "Language Analysis",
												type: "topic",
												score: 0.97,
											},
											{
												id: "https://openalex.org/keywords/preprint",
												label: "Preprint",
												type: "keyword",
												score: 0.90048593,
											},
											{
												id: "https://openalex.org/C43169469",
												label: "Preprint",
												type: "concept",
												score: 0.90048593,
											},
											{
												id: "https://openalex.org/C27415008",
												label: "Psychological intervention",
												type: "concept",
												score: 0.6779285,
											},
											{
												id: "https://openalex.org/C134362201",
												label: "Mental health",
												type: "concept",
												score: 0.6705434,
											},
											{
												id: "https://openalex.org/C26760741",
												label: "Perception",
												type: "concept",
												score: 0.5866521,
											},
											{
												id: "https://openalex.org/C15744967",
												label: "Psychology",
												type: "concept",
												score: 0.5511217,
											},
											{
												id: "https://openalex.org/keywords/survey-research",
												label: "Survey research",
												type: "keyword",
												score: 0.49300477,
											},
											{
												id: "https://openalex.org/C173481278",
												label: "Survey research",
												type: "concept",
												score: 0.49300477,
											},
											{
												id: "https://openalex.org/C75630572",
												label: "Applied psychology",
												type: "concept",
												score: 0.3665211,
											},
											{
												id: "https://openalex.org/C17744445",
												label: "Political science",
												type: "concept",
												score: 0.32603627,
											},
											{
												id: "https://openalex.org/C118552586",
												label: "Psychiatry",
												type: "concept",
												score: 0.18042797,
											},
											{
												id: "https://openalex.org/C41008148",
												label: "Computer science",
												type: "concept",
												score: 0.17103863,
											},
											{
												id: "https://openalex.org/C136764020",
												label: "World Wide Web",
												type: "concept",
												score: 0.081232846,
											},
											{
												id: "https://openalex.org/C169760540",
												label: "Neuroscience",
												type: "concept",
												score: 0,
											},
										],
										authorships: [
											{
												author: {
													id: "https://openalex.org/A5003352074",
													display_name: "Mahima Anna Varghese",
													institution:
														"Vellore Institute of Technology University",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5005018481",
													display_name: "Poonam Sharma",
													institution:
														"Vellore Institute of Technology University",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5104973569",
													display_name: "Maitreyee Patwardhan",
													institution: "India Habitat Centre",
												},
											},
										],
										primary_location: {
											source: {
												display_name: "JMIR Formative Research",
												host_organization_name: null,
											},
											landing_page_url: "https://doi.org/10.2196/64380",
										},
										published: "2024-09-30",
									},
									{
										score: 0.6915806,
										id: "https://openalex.org/W4396642133",
										title:
											"The emergence of AI in mental health: A transformative journey",
										created: "2024-05-05",
										abstract:
											"This paper traces the evolution of Artificial Intelligence (AI) in psychiatry, from early attempts like the ELIZA program to the integration of neuroimaging studies and the emergence of digital interventions. Utilizing deep learning models, AI now demonstrates high accuracy in classifying psychiatric disorders, such as schizophrenia based on functional connectivity patterns. The rise of AI chat/therapy bots, exemplified by Woebot and Tess, addresses mental health challenges, providing accessible and effective cognitive behavioral therapy tools. Innovative interventions like avatar therapy and intelligent animal-like robots contribute to broadening therapeutic perspectives. While AI-based interventions offer advantages in reducing stigma and increasing accessibility, challenges including diagnostic accuracy, legal responsibilities, and privacy concerns must be carefully considered. Despite challenges, the significant potential of AI in psychiatry calls for large, controlled trials, national standards, and responsible integration into clinical practice. The convergence of AI and psychiatry represents a technological revolution poised to transform mental health care delivery globally.",
										features: [
											{
												id: "https://openalex.org/T11519",
												label: "Digital Mental Health",
												type: "topic",
												score: 0.9895,
											},
											{
												id: "https://openalex.org/T13283",
												label: "Network Analysis",
												type: "topic",
												score: 0.9756,
											},
											{
												id: "https://openalex.org/T11636",
												label: "AI in Medicine",
												type: "topic",
												score: 0.964,
											},
											{
												id: "https://openalex.org/keywords/transformative-learning",
												label: "Transformative learning",
												type: "keyword",
												score: 0.88830996,
											},
											{
												id: "https://openalex.org/C70587473",
												label: "Transformative learning",
												type: "concept",
												score: 0.88830996,
											},
											{
												id: "https://openalex.org/C134362201",
												label: "Mental health",
												type: "concept",
												score: 0.62350494,
											},
											{
												id: "https://openalex.org/C15744967",
												label: "Psychology",
												type: "concept",
												score: 0.5454548,
											},
											{
												id: "https://openalex.org/keywords/therapist-support",
												label: "Therapist Support",
												type: "keyword",
												score: 0.481358,
											},
											{
												id: "https://openalex.org/C11171543",
												label: "Psychoanalysis",
												type: "concept",
												score: 0.40033424,
											},
											{
												id: "https://openalex.org/C144024400",
												label: "Sociology",
												type: "concept",
												score: 0.33160913,
											},
											{
												id: "https://openalex.org/C542102704",
												label: "Psychotherapist",
												type: "concept",
												score: 0.27596053,
											},
											{
												id: "https://openalex.org/C138496976",
												label: "Developmental psychology",
												type: "concept",
												score: 0.21165526,
											},
										],
										authorships: [
											{
												author: {
													id: "https://openalex.org/A5095931546",
													display_name: "Vinod Kumar Dhiman",
													institution:
														"Deenbandhu Chhotu Ram University of Science and Technology",
												},
											},
										],
										primary_location: {
											source: {
												display_name:
													"World Journal of Advanced Research and Reviews",
												host_organization_name: "GSC Online Press",
											},
											landing_page_url:
												"https://doi.org/10.30574/wjarr.2024.22.1.1298",
										},
										published: "2024-04-30",
									},
									{
										score: 0.6869842,
										id: "https://openalex.org/W4391108112",
										title:
											"Considering AI-driven therapy: When does human empathy matter? (Preprint)",
										created: "2024-01-23",
										abstract:
											"<sec> <title>UNSTRUCTURED</title> Recent breakthroughs in artificial intelligence (AI) language models have elevated the vision of using conversational AI support for mental health, with a growing body of literature indicating varying degrees of efficacy. In this paper, we ask when, in therapy, it will be easier to replace humans and, conversely, in what instances, human connection will still be more valued. We suggest that empathy lies at the heart of the answer to this question. First, we define different aspects of empathy and outline the potential empathic capabilities of humans versus AI. Next, we consider what determines when these aspects are needed most in therapy, both from the perspective of therapeutic methodology and from the perspective of patient objectives. Ultimately, our goal is to prompt further investigation and dialogue, urging both practitioners and scholars engaged in AI-mediated therapy to keep these questions and considerations in mind when investigating AI implementation in mental health. </sec>",
										features: [
											{
												id: "https://openalex.org/T11519",
												label: "Digital Mental Health",
												type: "topic",
												score: 0.9999,
											},
											{
												id: "https://openalex.org/T13283",
												label: "Network Analysis",
												type: "topic",
												score: 0.9997,
											},
											{
												id: "https://openalex.org/T11093",
												label: "Borderline Disorder",
												type: "topic",
												score: 0.9962,
											},
											{
												id: "https://openalex.org/C2779885105",
												label: "Empathy",
												type: "concept",
												score: 0.9094653,
											},
											{
												id: "https://openalex.org/C12713177",
												label: "Perspective (graphical)",
												type: "concept",
												score: 0.77706486,
											},
											{
												id: "https://openalex.org/keywords/preprint",
												label: "Preprint",
												type: "keyword",
												score: 0.69605315,
											},
											{
												id: "https://openalex.org/C43169469",
												label: "Preprint",
												type: "concept",
												score: 0.69605315,
											},
											{
												id: "https://openalex.org/C15744967",
												label: "Psychology",
												type: "concept",
												score: 0.5121162,
											},
											{
												id: "https://openalex.org/keywords/therapist-support",
												label: "Therapist Support",
												type: "keyword",
												score: 0.50315,
											},
											{
												id: "https://openalex.org/C134362201",
												label: "Mental health",
												type: "concept",
												score: 0.44348887,
											},
											{
												id: "https://openalex.org/C188147891",
												label: "Cognitive science",
												type: "concept",
												score: 0.43078423,
											},
											{
												id: "https://openalex.org/C542102704",
												label: "Psychotherapist",
												type: "concept",
												score: 0.43013006,
											},
											{
												id: "https://openalex.org/C105409693",
												label: "Human intelligence",
												type: "concept",
												score: 0.42075717,
											},
											{
												id: "https://openalex.org/C111472728",
												label: "Epistemology",
												type: "concept",
												score: 0.34249896,
											},
											{
												id: "https://openalex.org/C41008148",
												label: "Computer science",
												type: "concept",
												score: 0.24293402,
											},
											{
												id: "https://openalex.org/C154945302",
												label: "Artificial intelligence",
												type: "concept",
												score: 0.24079987,
											},
											{
												id: "https://openalex.org/C77805123",
												label: "Social psychology",
												type: "concept",
												score: 0.1816862,
											},
											{
												id: "https://openalex.org/C138496976",
												label: "Developmental psychology",
												type: "concept",
												score: 0.09968531,
											},
											{
												id: "https://openalex.org/C138885662",
												label: "Philosophy",
												type: "concept",
												score: 0.07820511,
											},
											{
												id: "https://openalex.org/C136764020",
												label: "World Wide Web",
												type: "concept",
												score: 0,
											},
										],
										authorships: [
											{
												author: {
													id: "https://openalex.org/A5104285776",
													display_name: "Matan Rubin",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5093763070",
													display_name: "Hadar Arnon",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5042405428",
													display_name: "Jonathan D. Huppert",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5054907278",
													display_name: "Anat Perry",
												},
											},
										],
										primary_location: {
											source: {},
											landing_page_url:
												"https://doi.org/10.2196/preprints.56529",
										},
										published: "2024-01-18",
									},
									{
										score: 0.683903,
										id: "https://openalex.org/W4392354123",
										title:
											"Artificial Intelligence in nursing: trustworthy or reliable?",
										created: "2024-03-05",
										abstract:
											"Trustworthiness in Artificial Intelligence (AI) innovation is a priority for governments, researchers and clinicians; however, clinicians have highlighted trust and confidence as barriers to their acceptance of AI within a clinical application. While there is a call to design and develop AI that is considered trustworthy, AI still lacks the emotional capability to facilitate the reciprocal nature of trust.",
										features: [
											{
												id: "https://openalex.org/T11636",
												label: "AI in Medicine",
												type: "topic",
												score: 0.9993,
											},
											{
												id: "https://openalex.org/T10177",
												label: "Palliative Care",
												type: "topic",
												score: 0.9723,
											},
											{
												id: "https://openalex.org/T10416",
												label: "Brain Injury",
												type: "topic",
												score: 0.9492,
											},
											{
												id: "https://openalex.org/keywords/trustworthiness",
												label: "Trustworthiness",
												type: "keyword",
												score: 0.924162,
											},
											{
												id: "https://openalex.org/C153701036",
												label: "Trustworthiness",
												type: "concept",
												score: 0.924162,
											},
											{
												id: "https://openalex.org/keywords/reciprocal",
												label: "Reciprocal",
												type: "keyword",
												score: 0.5832353,
											},
											{
												id: "https://openalex.org/C2777742833",
												label: "Reciprocal",
												type: "concept",
												score: 0.5832353,
											},
											{
												id: "https://openalex.org/C15744967",
												label: "Psychology",
												type: "concept",
												score: 0.48273486,
											},
											{
												id: "https://openalex.org/C159110408",
												label: "Nursing",
												type: "concept",
												score: 0.45881423,
											},
											{
												id: "https://openalex.org/keywords/artificial-intelligences",
												label: "Artificial Intelligences",
												type: "keyword",
												score: 0.446357,
											},
											{
												id: "https://openalex.org/C41008148",
												label: "Computer science",
												type: "concept",
												score: 0.42549077,
											},
											{
												id: "https://openalex.org/C56739046",
												label: "Knowledge management",
												type: "concept",
												score: 0.42530334,
											},
											{
												id: "https://openalex.org/C154945302",
												label: "Artificial intelligence",
												type: "concept",
												score: 0.33646774,
											},
											{
												id: "https://openalex.org/C71924100",
												label: "Medicine",
												type: "concept",
												score: 0.3072965,
											},
											{
												id: "https://openalex.org/C77805123",
												label: "Social psychology",
												type: "concept",
												score: 0.2274571,
											},
											{
												id: "https://openalex.org/C41895202",
												label: "Linguistics",
												type: "concept",
												score: 0,
											},
											{
												id: "https://openalex.org/C138885662",
												label: "Philosophy",
												type: "concept",
												score: 0,
											},
										],
										authorships: [
											{
												author: {
													id: "https://openalex.org/A5076828804",
													display_name: "Oliver Higgins",
													institution: "University of Newcastle Australia",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5054614441",
													display_name: "Stephan K. Chalup",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5029316442",
													display_name: "Rhonda Wilson",
													institution: "Gosford Hospital",
												},
											},
										],
										primary_location: {
											source: {
												display_name: "Journal of research in nursing",
												host_organization_name: "SAGE Publishing",
											},
											landing_page_url:
												"https://doi.org/10.1177/17449871231215696",
										},
										published: "2024-02-29",
									},
									{
										score: 0.68323505,
										id: "https://openalex.org/W4403962195",
										title:
											"Can AI replace psychotherapists? Exploring the future of mental health care",
										created: "2024-11-01",
										abstract:
											"against the growing prevalence of mental health issues (7,8).AI's role in mental health care is multifaceted, encompassing predictive analytics, therapeutic interventions, clinician support tools, and patient monitoring systems (9). For instance, AI algorithms are increasingly used to predict treatment outcomes by analyzing patient data (10). Meanwhile, AI-powered interventions, such as virtual reality exposure therapy and chatbot-delivered cognitive behavioral therapy, are being explored, though they are at varying stages of validation (11,12). Each of these applications is evolving at its own pace, influenced by technological advancements and the need for rigorous clinical validation.AI's capabilities in handling extensive datasets and analyzing complex behavioral patterns position it as a revolutionary force capable of transforming mental health care by offering advanced detection methods, personalized treatment plans, and virtual therapeutic platforms that could dramatically increase accessibility, reduce stigma, and enhance treatment outcomes (13,14,15,4).Furthermore, the role of AI in mental health extends to potentially replacing certain functions traditionally performed by human psychotherapists. Innovations in machine learning and natural language processing have enabled AI systems like ChatGPT to recognize and process complex human emotions, facilitating interactions that once required the nuanced understanding of trained therapists (16,17). Preliminary studies suggest that AI-powered chatbots may help alleviate symptoms of anxiety and depression (18,19). However, these studies often involve small participant groups and lack long-term follow-up, making it difficult to draw definitive conclusions about their effectiveness. Consequently, while AI interventions hold promise, further research through large-scale, randomized controlled trials is necessary to establish their efficacy and sustainability over time.Studies have shown that AI-powered chatbots can effectively reduce symptoms of anxiety and depression, offering a level of interaction that suggests machines might soon match or even surpass human capabilities in certain aspects of psychotherapy (18,19,20,21).Although these studies indicate short-term benefits, meta-analyses have shown that these effects may not be sustained in the long term, with no significant changes observed over extended periods (22).As AI continues to evolve and become more deeply integrated into the mental healthcare sector, its potential to fundamentally transform the field is undeniable. At a time when mental health issues have reached pandemic proportions globally, affecting productivity and quality of life (23,24), the need for innovative solutions is urgent.",
										features: [
											{
												id: "https://openalex.org/T10272",
												label: "Stigma Impact",
												type: "topic",
												score: 0.9982,
											},
											{
												id: "https://openalex.org/T11519",
												label: "Digital Mental Health",
												type: "topic",
												score: 0.9967,
											},
											{
												id: "https://openalex.org/T12308",
												label: "Health Philosophy",
												type: "topic",
												score: 0.9904,
											},
											{
												id: "https://openalex.org/C134362201",
												label: "Mental health",
												type: "concept",
												score: 0.6167934,
											},
											{
												id: "https://openalex.org/C15744967",
												label: "Psychology",
												type: "concept",
												score: 0.6096347,
											},
											{
												id: "https://openalex.org/keywords/mental-health-care",
												label: "Mental Health Care",
												type: "keyword",
												score: 0.5092696,
											},
											{
												id: "https://openalex.org/C2992545881",
												label: "Mental health care",
												type: "concept",
												score: 0.5092696,
											},
											{
												id: "https://openalex.org/C542102704",
												label: "Psychotherapist",
												type: "concept",
												score: 0.42161185,
											},
										],
										authorships: [
											{
												author: {
													id: "https://openalex.org/A5100451619",
													display_name: "Zhihui Zhang",
													institution: "Universitat Politècnica de Catalunya",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5100378370",
													display_name: "Jing Wang",
													institution: "Shenzhen Second People's Hospital",
												},
											},
										],
										primary_location: {
											source: {
												display_name: "Frontiers in Psychiatry",
												host_organization_name: "Frontiers Media",
											},
											landing_page_url:
												"https://doi.org/10.3389/fpsyt.2024.1444382",
										},
										published: "2024-10-31",
									},
									{
										score: 0.68091685,
										id: "https://openalex.org/W4395055188",
										title:
											"Considering the Role of Human Empathy in AI-Driven Therapy",
										created: "2024-04-24",
										abstract:
											"Recent breakthroughs in artificial intelligence (AI) language models have elevated the vision of using conversational AI support for mental health, with a growing body of literature indicating varying degrees of efficacy. In this paper, we ask when, in therapy, it will be easier to replace humans and, conversely, in what instances, human connection will still be more valued. We suggest that empathy lies at the heart of the answer to this question. First, we define different aspects of empathy and outline the potential empathic capabilities of humans versus AI. Next, we consider what determines when these aspects are needed most in therapy, both from the perspective of therapeutic methodology and from the perspective of patient objectives. Ultimately, our goal is to prompt further investigation and dialogue, urging both practitioners and scholars engaged in AI-mediated therapy to keep these questions and considerations in mind when investigating AI implementation in mental health.",
										features: [
											{
												id: "https://openalex.org/T11519",
												label: "Digital Mental Health",
												type: "topic",
												score: 0.9991,
											},
											{
												id: "https://openalex.org/T13283",
												label: "Network Analysis",
												type: "topic",
												score: 0.9971,
											},
											{
												id: "https://openalex.org/T12308",
												label: "Health Philosophy",
												type: "topic",
												score: 0.9834,
											},
											{
												id: "https://openalex.org/C2779885105",
												label: "Empathy",
												type: "concept",
												score: 0.57700056,
											},
											{
												id: "https://openalex.org/keywords/therapist-support",
												label: "Therapist Support",
												type: "keyword",
												score: 0.569166,
											},
											{
												id: "https://openalex.org/keywords/cognitive-behavioral-therapy",
												label: "Cognitive-Behavioral Therapy",
												type: "keyword",
												score: 0.565075,
											},
											{
												id: "https://openalex.org/keywords/temporal-experience",
												label: "Temporal Experience",
												type: "keyword",
												score: 0.553337,
											},
											{
												id: "https://openalex.org/C542102704",
												label: "Psychotherapist",
												type: "concept",
												score: 0.53896755,
											},
											{
												id: "https://openalex.org/keywords/person-centered-medicine",
												label: "Person-Centered Medicine",
												type: "keyword",
												score: 0.535963,
											},
											{
												id: "https://openalex.org/keywords/psychometric-models",
												label: "Psychometric Models",
												type: "keyword",
												score: 0.526327,
											},
											{
												id: "https://openalex.org/C15744967",
												label: "Psychology",
												type: "concept",
												score: 0.51501226,
											},
											{
												id: "https://openalex.org/C71924100",
												label: "Medicine",
												type: "concept",
												score: 0.3424691,
											},
											{
												id: "https://openalex.org/C118552586",
												label: "Psychiatry",
												type: "concept",
												score: 0.1826179,
											},
										],
										authorships: [
											{
												author: {
													id: "https://openalex.org/A5104285776",
													display_name: "Matan Rubin",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5093763070",
													display_name: "Hadar Arnon",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5042405428",
													display_name: "Jonathan D. Huppert",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5054907278",
													display_name: "Anat Perry",
												},
											},
										],
										primary_location: {
											source: {
												display_name: "JMIR Mental Health",
												host_organization_name: "JMIR Publications",
											},
											landing_page_url: "https://doi.org/10.2196/56529",
										},
										published: "2024-04-23",
									},
									{
										score: 0.67765296,
										id: "https://openalex.org/W4396974499",
										title:
											"(Why) Do We Trust AI?: A Case of AI-based Health Chatbots",
										created: "2024-05-17",
										abstract:
											"Automated chatbots powered by artificial intelligence (AI) can act as a ubiquitous point of contact, improving access to healthcare and empowering users to make effective decisions. However, despite the potential benefits, emerging literature suggests that apprehensions linked to the distinctive features of AI technology and the specific context of use (healthcare) could undermine consumer trust and hinder widespread adoption. Although the role of trust is considered pivotal to the acceptance of healthcare technologies, a dearth of research exists that focuses on the contextual factors that drive trust in such AI-based Chatbots for Self-Diagnosis (AICSD). Accordingly, a contextual model based on the trust-in-technology framework was developed to understand the determinants of consumers’ trust in AICSD and its behavioral consequences. It was validated using a free simulation experiment study in India (N = 202). Perceived anthropomorphism, perceived information quality, perceived explainability, disposition to trust technology, and perceived service quality influence consumers’ trust in AICSD. In turn, trust, privacy risk, health risk, and gender determine the intention to use. The research contributes by developing and validating a context-specific model for explaining trust in AICSD that could aid developers and marketers in enhancing consumers’ trust in and adoption of AICSD.",
										features: [
											{
												id: "https://openalex.org/T11519",
												label: "Digital Mental Health",
												type: "topic",
												score: 0.8863,
											},
											{
												id: "https://openalex.org/T10883",
												label: "AI Ethics",
												type: "topic",
												score: 0.8856,
											},
											{
												id: "https://openalex.org/T12128",
												label: "AI in Service",
												type: "topic",
												score: 0.8854,
											},
											{
												id: "https://openalex.org/keywords/chatbots",
												label: "Chatbots",
												type: "keyword",
												score: 0.620733,
											},
											{
												id: "https://openalex.org/keywords/human-robot-interaction",
												label: "Human-Robot Interaction",
												type: "keyword",
												score: 0.509968,
											},
											{
												id: "https://openalex.org/keywords/artificial-intelligences",
												label: "Artificial Intelligences",
												type: "keyword",
												score: 0.502468,
											},
											{
												id: "https://openalex.org/C15744967",
												label: "Psychology",
												type: "concept",
												score: 0.4361616,
											},
											{
												id: "https://openalex.org/C41008148",
												label: "Computer science",
												type: "concept",
												score: 0.39939684,
											},
											{
												id: "https://openalex.org/C154945302",
												label: "Artificial intelligence",
												type: "concept",
												score: 0.37931553,
											},
										],
										authorships: [
											{
												author: {
													id: "https://openalex.org/A5084138407",
													display_name: "Ashish Viswanath Prakash",
													institution:
														"Indian Institute of Management Tiruchirappalli",
												},
											},
											{
												author: {
													id: "https://openalex.org/A5048474556",
													display_name: "Saini Das",
													institution:
														"Indian Institute of Technology Kharagpur",
												},
											},
										],
										primary_location: {
											source: {
												display_name:
													"AJIS. Australasian journal of information systems/AJIS. Australian journal of information systems/Australian journal of information systems",
												host_organization_name:
													"Australasian Association for Information Systems",
											},
											landing_page_url: "https://doi.org/10.3127/ajis.v28.4235",
										},
										published: "2024-05-15",
									},
								],
							},
						},
					],
				},
				{
					role: "assistant",
					content: [
						{
							type: "text",
							text: "Trust in AI for therapy is mixed. While AI can enhance therapy accessibility and effectiveness, concerns about empathy and human connection remain [1]. Some studies show AI chatbots can match human therapists in quality, but trust issues persist due to AI's lack of emotional understanding [2]. Public perception and acceptance are crucial for AI's success in mental health interventions [3].",
						},
					],
				},
			],
		},
	},
];
