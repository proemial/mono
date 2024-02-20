import {
	AIMessage,
	BaseMessage,
	HumanMessage,
	mapChatMessagesToStoredMessages,
} from "@langchain/core/messages";
import { FakeListChatModel } from "@langchain/core/utils/testing";
import { neonDb } from "@proemial/data";
import { eq } from "drizzle-orm";
import { answerEngineMemory } from "../../../../../../packages/data/neon/schema/answer-engine-memory";
import {
	AnswerEngineChatMessageHistory,
	messageMemory,
} from "./answer-engine-memory";
import { fetchPapersChain } from "./fetch-papers-chain";

// vi.mock("../../../../../../packages/data", async (importOriginal) => {
//   return {
//     AnswerEngineChatMessageHistory: class AnswerEngineChatMessageHistory {
//       private messages = [new HumanMessage("Hi!")];
//       async getMessages() {
//         return this.messages;
//       }

//       async addMessges(message: BaseMessage) {
//         this.messages.push(message);
//       }
//     },
//   };
// });
const MOCKED_PAPER_RESPONSE = [
	{
		link: "/oa/W2519901476",
		abstract:
			"BackgroundPublic trust in immunization is an increasingly important global health issue. Losses in confidence in vaccines and immunization programmes can lead to vaccine reluctance and refusal, risking disease outbreaks and challenging immunization goals in high- and low-income settings. National and international immunization stakeholders have called for better monitoring of vaccine confidence to identify emerging concerns before they evolve into vaccine confidence crises.MethodsWe perform a large-scale, data-driven study on worldwide attitudes to immunizations. This survey – which we believe represents the largest survey on confidence in immunization to date – examines perceptions of vaccine importance, safety, effectiveness, and religious compatibility among 65,819 individuals across 67 countries. Hierarchical models are employed to probe relationships between individual- and country-level socio-economic factors and vaccine attitudes obtained through the four-question, Likert-scale survey.FindingsOverall sentiment towards vaccinations is positive across all 67 countries, however there is wide variability between countries and across world regions. Vaccine-safety related sentiment is particularly negative in the European region, which has seven of the ten least confident countries, with 41% of respondents in France and 36% of respondents in Bosnia & Herzegovina reporting that they disagree that vaccines are safe (compared to a global average of 13%). The oldest age group (65+) and Roman Catholics (amongst all faiths surveyed) are associated with positive views on vaccine sentiment, while the Western Pacific region reported the highest level of religious incompatibility with vaccines. Countries with high levels of schooling and good access to health services are associated with lower rates of positive sentiment, pointing to an emerging inverse relationship between vaccine sentiments and socio-economic status.ConclusionsRegular monitoring of vaccine attitudes – coupled with monitoring of local immunization rates – at the national and sub-national levels can identify populations with declining confidence and acceptance. These populations should be prioritized to further investigate the drivers of negative sentiment and to inform appropriate interventions to prevent adverse public health outcomes.",
		title:
			"The State of Vaccine Confidence 2016: Global Insights Through a 67-Country Survey",
	},
	{
		link: "/oa/W4241169271",
		abstract:
			"Observations in the early 1990s that plasmid DNA could directly transfect animal cells in vivo sparked exploration of the use of DNA plasmids to induce immune responses by direct injection into animals of DNA encoding antigenic proteins. This method, termed DNA immunization, now has been used to elicit protective antibody and cell-mediated immune responses in a wide variety of preclinical animal models for viral, bacterial, and parasitic diseases. DNA vaccination is particularly useful for the induction of cytotoxic T cells. This review summarizes current knowledge on the vectors, immune responses, immunological mechanisms, safety considerations, and potential for further application of this novel method of immunization.",
		title: "DNA VACCINES",
	},
	{
		link: "/oa/W2075410325",
		abstract:
			'The goals were (1) to obtain national estimates of the proportions of parents with indicators of vaccine doubt, (2) to identify factors associated with those parents, compared with parents reporting no vaccine doubt indicators, (3) to identify the specific vaccines that prompted doubt and the reasons why, and (4) to describe the main reasons parents changed their minds about delaying or refusing a vaccine for their child.Data were from the National Immunization Survey (2003-2004). Groups included parents who ever got a vaccination for their child although they were not sure it was the best thing to do ("unsure"), delayed a vaccination for their child ("delayed"), or decided not to have their child get a vaccination ("refused").A total of 3924 interviews were completed. Response rates were 57.9% in 2003 and 65.0% in 2004. Twenty-eight percent of parents responded yes to ever experiencing >or=1 of the outcome measures listed above. In separate analyses for each outcome measure, vaccine safety concern was a predictor for unsure, refused, and delayed parents. The largest proportions of unsure and refused parents chose varicella vaccine as the vaccine prompting their concern, whereas delayed parents most often reported "not a specific vaccine" as the vaccine prompting their concern. Most parents who delayed vaccines for their child did so for reasons related to their child\'s illness, unlike the unsure and refused parents. The largest proportion of parents who changed their minds about delaying or not getting a vaccination for their child listed "information or assurances from health care provider" as the main reason.Parents who exhibit doubts about immunizations are not all the same. This research suggests encouraging children\'s health care providers to solicit questions about vaccines, to establish a trusting relationship, and to provide appropriate educational materials to parents.',
		title: "Parents With Doubts About Vaccines: Which Vaccines and Reasons Why",
	},
	{
		link: "/oa/W2025926911",
		abstract:
			"There has been enormous debate regarding the possibility of a link between childhood vaccinations and the subsequent development of autism. This has in recent times become a major public health issue with vaccine preventable diseases increasing in the community due to the fear of a 'link' between vaccinations and autism. We performed a meta-analysis to summarise available evidence from case-control and cohort studies on this topic (MEDLINE, PubMed, EMBASE, Google Scholar up to April, 2014). Eligible studies assessed the relationship between vaccine administration and the subsequent development of autism or autism spectrum disorders (ASD). Two reviewers extracted data on study characteristics, methods, and outcomes. Disagreement was resolved by consensus with another author. Five cohort studies involving 1,256,407 children, and five case-control studies involving 9,920 children were included in this analysis. The cohort data revealed no relationship between vaccination and autism (OR: 0.99; 95% CI: 0.92 to 1.06) or ASD (OR: 0.91; 95% CI: 0.68 to 1.20), nor was there a relationship between autism and MMR (OR: 0.84; 95% CI: 0.70 to 1.01), or thimerosal (OR: 1.00; 95% CI: 0.77 to 1.31), or mercury (Hg) (OR: 1.00; 95% CI: 0.93 to 1.07). Similarly the case-control data found no evidence for increased risk of developing autism or ASD following MMR, Hg, or thimerosal exposure when grouped by condition (OR: 0.90, 95% CI: 0.83 to 0.98; p=0.02) or grouped by exposure type (OR: 0.85, 95% CI: 0.76 to 0.95; p=0.01). Findings of this meta-analysis suggest that vaccinations are not associated with the development of autism or autism spectrum disorder. Furthermore, the components of the vaccines (thimerosal or mercury) or multiple vaccines (MMR) are not associated with the development of autism or autism spectrum disorder.",
		title:
			"Vaccines are not associated with autism: An evidence-based meta-analysis of case-control and cohort studies",
	},
	{
		link: "/oa/W3093951335",
		abstract:
			"Background Understanding the threat posed by anti-vaccination efforts on social media is critically important with the forth coming need for world wide COVID-19 vaccination programs. We globally evaluate the effect of social media and online foreign disinformation campaigns on vaccination rates and attitudes towards vaccine safety. Methods Weuse a large-n cross-country regression framework to evaluate the effect ofsocial media on vaccine hesitancy globally. To do so, we operationalize social media usage in two dimensions: the use of it by the public to organize action(using Digital Society Project indicators), and the level of negative lyoriented discourse about vaccines on social media (using a data set of all geocoded tweets in the world from 2018-2019). In addition, we measure the level of foreign-sourced coordinated disinformation operations on social media ineach country (using Digital Society Project indicators). The outcome of vaccine hesitancy is measured in two ways. First, we use polls of what proportion ofthe public per country feels vaccines are unsafe (using Wellcome Global Monitor indicators for 137 countries). Second, we use annual data of actual vaccination rates from the WHO for 166 countries. Results We found the use of social media to organise offline action to be highly predictive of the belief that vaccinations are unsafe, with such beliefs mounting as more organisation occurs on social media. In addition, the prevalence of foreign disinformation is highly statistically and substantively significant in predicting a drop in mean vaccination coverage over time. A 1-point shift upwards in the 5-point disinformation scale is associated with a 2-percentage point drop in mean vaccination coverage year over year. We also found support for the connection of foreign disinformation with negative social media activity about vaccination. The substantive effect of foreign disinformation is to increase the number of negative vaccine tweets by 15% for the median country. Conclusion There is a significant relationship between organisation on social media and public doubts of vaccine safety. In addition, there is a substantial relationship between foreign disinformation campaigns and declining vaccination coverage.",
		title: "Social media and vaccine hesitancy",
	},
	{
		link: "/oa/W2511594916",
		abstract:
			"Immunizations have led to a significant decrease in rates of vaccine-preventable diseases and have made a significant impact on the health of children. However, some parents express concerns about vaccine safety and the necessity of vaccines. The concerns of parents range from hesitancy about some immunizations to refusal of all vaccines. This clinical report provides information about addressing parental concerns about vaccination.",
		title: "Countering Vaccine Hesitancy",
	},
	{
		link: "/oa/W2016277644",
		abstract:
			"Seasonal influenza is responsible for thousands of deaths and billions of dollars of medical costs per year in the United States, but influenza vaccination coverage remains substantially below public health targets. One possible obstacle to greater immunization rates is the false belief that it is possible to contract the flu from the flu vaccine. A nationally representative survey experiment was conducted to assess the extent of this flu vaccine misperception. We find that a substantial portion of the public (43%) believes that the flu vaccine can give you the flu. We also evaluate how an intervention designed to address this concern affects belief in the myth, concerns about flu vaccine safety, and future intent to vaccinate. Corrective information adapted from the Centers for Disease Control and Prevention (CDC) website significantly reduced belief in the myth that the flu vaccine can give you the flu as well as concerns about its safety. However, the correction also significantly reduced intent to vaccinate among respondents with high levels of concern about vaccine side effects – a response that was not observed among those with low levels of concern. This result, which is consistent with previous research on misperceptions about the MMR vaccine, suggests that correcting myths about vaccines may not be an effective approach to promoting immunization.",
		title:
			"Does correcting myths about the flu vaccine work? An experimental evaluation of the effects of corrective information",
	},
	{
		link: "/oa/W979396035",
		abstract:
			"The Centers for Disease Control and Prevention (CDC) and the U.S. Food and Drug Administration (FDA) conduct post-licensure vaccine safety monitoring using the Vaccine Adverse Event Reporting System (VAERS), a spontaneous (or passive) reporting system. This means that after a vaccine is approved, CDC and FDA continue to monitor safety while it is distributed in the marketplace for use by collecting and analyzing spontaneous reports of adverse events that occur in persons following vaccination. Various methods and statistical techniques are used to analyze VAERS data, which CDC and FDA use to guide further safety evaluations and inform decisions around vaccine recommendations and regulatory action. VAERS data must be interpreted with caution due to the inherent limitations of passive surveillance. VAERS is primarily a safety signal detection and hypothesis generating system. Generally, VAERS data cannot be used to determine if a vaccine caused an adverse event. VAERS data interpreted alone or out of context can lead to erroneous conclusions about cause and effect as well as the risk of adverse events occurring following vaccination. CDC makes VAERS data available to the public and readily accessible online. We describe fundamental vaccine safety concepts, provide an overview of VAERS for healthcare professionals who provide vaccinations and might want to report or better understand a vaccine adverse event, and explain how CDC and FDA analyze VAERS data. We also describe strengths and limitations, and address common misconceptions about VAERS. Information in this review will be helpful for healthcare professionals counseling patients, parents, and others on vaccine safety and benefit-risk balance of vaccination.",
		title:
			"Safety monitoring in the Vaccine Adverse Event Reporting System (VAERS)",
	},
	{
		link: "/oa/W2004911979",
		abstract:
			"Because of the large preexisting antigenic load and immunosuppressive environment within a tumor, inducing therapeutically useful antitumor immunity in cancer patients requires the development of powerful vaccination protocols. An approach gaining increasing popularity in the tumor vaccine field is to immunize cancer patients with their own DCs loaded ex vivo with tumor antigens. The underlying premise of this approach is that the efficiency and control over the vaccination process provided by ex vivo manipulation of the DCs generates an optimally potent APC and a superior method for stimulating antitumor immunity in vivo compared with the more conventional direct vaccination methods, offsetting the added cost and complexity associated with this form of customized cell therapy.",
		title: "DC-based cancer vaccines",
	},
	{
		link: "/oa/W2033659037",
		abstract:
			"The United States has made tremendous progress in using vaccines to prevent serious, often infectious, diseases. But concerns about such issues as vaccines' safety and the increasing complexity of immunization schedules have fostered doubts about the necessity of vaccinations. We investigated parents' confidence in childhood vaccines by reviewing recent survey data. We found that most parents--even those whose children receive all of the recommended vaccines--have questions, concerns, or misperceptions about them. We suggest ways to give parents the information they need and to keep the US national vaccination program a success.",
		title:
			"Confidence About Vaccines In The United States: Understanding Parents’ Perceptions",
	},
	{
		link: "/oa/W2055802294",
		abstract:
			'The search for methods of vaccine delivery not requiring a needle and syringe has been accelerated by recent concerns regarding pandemic disease, bioterrorism, and disease eradication campaigns. Needle-free vaccine delivery could aid in these mass vaccinations by increasing ease and speed of delivery, and by offering improved safety and compliance, decreasing costs, and reducing pain associated with vaccinations. In this article, we summarize the rationale for delivery of needle-free vaccines and discuss several methods currently in use and under development, focusing on needle-free injection devices, transcutaneous immunization, and mucosal immunization. Jet injectors are needle-free devices that deliver liquid vaccine through a nozzle orifice and penetrate the skin with a high-speed narrow stream. They generate improved or equivalent immune responses compared with needle and syringe. Powder injection, a form of jet injection using vaccines in powder form, may obviate the need for the "cold chain." Transcutaneous immunization involves applying vaccine antigen and adjuvant to the skin, using a patch or "microneedles," and can induce both systemic and mucosal immunity. Mucosal immunization has thus far been focused on oral, nasal, and aerosol vaccines. Promising newer technologies in oral vaccination include using attenuated bacteria as vectors and transgenic plant "edible" vaccines. Improved knowledge regarding the immune system and its responses to vaccination continues to inform vaccine technologies for needle-free vaccine delivery.',
		title: "Needle-free vaccine delivery☆",
	},
	{
		link: "/oa/W2036897121",
		abstract:
			"Pertussis immunization of adults may be necessary to improve the control of a rising burden of disease and infection. This trial of an acellular pertussis vaccine among adolescents and adults evaluated the incidence of pertussis, vaccine safety, immunogenicity, and protective efficacy.",
		title:
			"Efficacy of an Acellular Pertussis Vaccine among Adolescents and Adults",
	},
	{
		link: "/oa/W2063713720",
		abstract:
			"Parents who have concerns about vaccine safety may be reluctant to have their children vaccinated. The purpose of this study was to explore how vaccination coverage among children 19 to 35 months of age is associated with health care providers' influence on parents' decision to vaccinate their children, and with parents' beliefs about vaccine safety.Parents of 7695 children 19 to 35 months of age sampled by the National Immunization Survey were administered the National Immunization Survey Parental Knowledge Module between the third quarter of 2001 and the fourth quarter of 2002. Health care providers were defined as a physician, nurse, or any other type of health care professional. Parents provided responses that summarized the degree to which they believed vaccines were safe, and the influence providers had on their decisions to vaccinate their children. Children were determined to be up-to-date if their vaccination providers reported administering > or = 4 doses of diphtheria and tetanus toxoids and acellular pertussis vaccine, > or = 3 doses of polio vaccine, > or = 1 dose of measles-mumps-rubella vaccine, > or = 3 doses of Haemophilus influenzae type b vaccine, and > or = 3 doses of hepatitis B vaccine.Of all of the parents, 5.7% thought that vaccines were not safe, and 21.5% said that their decision to vaccinate their children was not influenced by a health care provider. Compared with parents who responded that providers were not influential in their decision to vaccinate their children, parents who responded that providers were influential were twice as likely to respond that vaccines were safe for children. Among children whose parents believed that vaccines were not safe, those whose parents' decision to vaccinate was influenced by a health care provider had an estimated vaccination coverage rate that was significantly higher than the estimated coverage rate among children whose parents' decision was not influenced by a health care provider (74.4% vs 50.3%; estimated difference: 24.1%).Health care providers have a positive influence on parents to vaccinate their children, including parents who believe that vaccinations are unsafe. Physicians, nurses, and other health care professionals should increase their efforts to build honest and respectful relationships with parents, especially when parents express concerns about vaccine safety or have misconceptions about the benefits and risks of vaccinations.",
		title:
			"Association Between Health Care Providers' Influence on Parents Who Have Concerns About Vaccine Safety and Vaccination Coverage",
	},
	{
		link: "/oa/W3182978015",
		abstract:
			"Widespread acceptance of COVID-19 vaccines is crucial for achieving sufficient immunization coverage to end the global pandemic, yet few studies have investigated COVID-19 vaccination attitudes in lower-income countries, where large-scale vaccination is just beginning. We analyze COVID-19 vaccine acceptance across 15 survey samples covering 10 low- and middle-income countries (LMICs) in Asia, Africa and South America, Russia (an upper-middle-income country) and the United States, including a total of 44,260 individuals. We find considerably higher willingness to take a COVID-19 vaccine in our LMIC samples (mean 80.3%; median 78%; range 30.1 percentage points) compared with the United States (mean 64.6%) and Russia (mean 30.4%). Vaccine acceptance in LMICs is primarily explained by an interest in personal protection against COVID-19, while concern about side effects is the most common reason for hesitancy. Health workers are the most trusted sources of guidance about COVID-19 vaccines. Evidence from this sample of LMICs suggests that prioritizing vaccine distribution to the Global South should yield high returns in advancing global immunization coverage. Vaccination campaigns should focus on translating the high levels of stated acceptance into actual uptake. Messages highlighting vaccine efficacy and safety, delivered by healthcare workers, could be effective for addressing any remaining hesitancy in the analyzed LMICs.",
		title:
			"COVID-19 vaccine acceptance and hesitancy in low- and middle-income countries",
	},
	{
		link: "/oa/W1997780854",
		abstract:
			"The availability of prophylactic human papillomavirus (HPV) vaccines has provided powerful tools for primary prevention of cervical cancer and other HPV-associated diseases. Since 2006, the quadrivalent and bivalent vaccines have each been licensed in over 100 countries. By the beginning of 2012, HPV vaccine had been introduced into national immunization programs in at least 40 countries. Australia, the United Kingdom, the United States, and Canada were among the first countries to introduce HPV vaccination. In Europe, the number of countries having introduced vaccine increased from 3 in 2007 to 22 at the beginning of 2012. While all country programs target young adolescent girls, specific target age groups vary as do catch-up recommendations. Different health care systems and infrastructure have resulted in varied implementation strategies, with some countries delivering vaccine in schools and others through health centers or primary care providers. Within the first 5 years after vaccines became available, few low- or middle-income countries had introduced HPV vaccine. The main reason was budgetary constraints due to the high vaccine cost. Bhutan and Rwanda implemented national immunization after receiving vaccine through donation programs in 2010 and 2011, respectively. The GAVI Alliance decision in 2011 to support HPV vaccination should increase implementation in low-income countries. Evaluation of vaccination programs includes monitoring of coverage, safety, and impact. Vaccine safety monitoring is part of routine activities in many countries. Safety evaluations are important and communication about vaccine safety is critical, as events temporally associated with vaccination can be falsely attributed to vaccination. Anti-vaccination efforts, in part related to concerns about safety, have been mounted in several countries. In the 5 years since HPV vaccines were licensed, there have been successes as well as challenges with vaccine introduction and implementation. Further progress is anticipated in the coming years, especially in low- and middle-income countries where the need for vaccine is greatest. This article forms part of a special supplement entitled “Comprehensive Control of HPV Infections and Related Diseases” Vaccine Volume 30, Supplement 5, 2012.",
		title: "Human Papillomavirus Vaccine Introduction – The First Five Years",
	},
	{
		link: "/oa/W2130219862",
		abstract:
			"The Vaccine Safety Datalink (VSD) project is a collaborative project between the Centers for Disease Control and Prevention and 8 managed care organizations (MCOs) in the United States. Established in 1990 to conduct postmarketing evaluations of vaccine safety, the project has created an infrastructure that allows for high-quality research and surveillance. The 8 participating MCOs comprise a large population of 8.8 million members annually (3% of the US population), which enables researchers to conduct studies that assess adverse events after immunization. Each MCO prepares computerized data files by using a standardized data dictionary containing demographic and medical information on its members, such as age and gender, health plan enrollment, vaccinations, hospitalizations, outpatient clinic visits, emergency department visits, urgent care visits, and mortality data, as well as additional birth information (eg, birth weight) when available. Other information sources, such as medical chart review, member surveys, and pharmacy, laboratory, and radiology data, are often used in VSD studies to validate outcomes and vaccination data. Since 2000, the VSD has undergone significant changes including an increase in the number of participating MCOs and enrolled population, changes in data-collection procedures, the creation of near real-time data files, and the development of near real-time postmarketing surveillance for newly licensed vaccines or changes in vaccine recommendations. Recognized as an important resource in vaccine safety, the VSD is working toward increasing transparency through data-sharing and external input. With its recent enhancements, the VSD provides scientific expertise, continues to develop innovative approaches for vaccine-safety research, and may serve as a model for other patient safety collaborative research projects.",
		title:
			"The Vaccine Safety Datalink: A Model for Monitoring Immunization Safety",
	},
	{
		link: "/oa/W1235838730",
		abstract:
			"Vaccine hesitancy reflects concerns about the decision to vaccinate oneself or one’s children. There is a broad range of factors contributing to vaccine hesitancy, including the compulsory nature of vaccines, their coincidental temporal relationships to adverse health outcomes, unfamiliarity with vaccine-preventable diseases, and lack of trust in corporations and public health agencies. Although vaccination is a norm in the U.S. and the majority of parents vaccinate their children, many do so amid concerns. The proportion of parents claiming non-medical exemptions to school immunization requirements has been increasing over the past decade. Vaccine refusal has been associated with outbreaks of invasive Haemophilus influenzae type b disease, varicella, pneumococcal disease, measles, and pertussis, resulting in the unnecessary suffering of young children and waste of limited public health resources. Vaccine hesitancy is an extremely important issue that needs to be addressed because effective control of vaccine-preventable diseases generally requires indefinite maintenance of extremely high rates of timely vaccination. The multifactorial and complex causes of vaccine hesitancy require a broad range of approaches on the individual, provider, health system, and national levels. These include standardized measurement tools to quantify and locate clustering of vaccine hesitancy and better understand issues of trust; rapid, independent, and transparent review of an enhanced and appropriately funded vaccine safety system; adequate reimbursement for vaccine risk communication in doctors’ offices; and individually tailored messages for parents who have vaccine concerns, especially first-time pregnant women. The potential of vaccines to prevent illness and save lives has never been greater. Yet, that potential is directly dependent on parental acceptance of vaccines, which requires confidence in vaccines, healthcare providers who recommend and administer vaccines, and the systems to make sure vaccines are safe. Vaccine hesitancy reflects concerns about the decision to vaccinate oneself or one’s children. There is a broad range of factors contributing to vaccine hesitancy, including the compulsory nature of vaccines, their coincidental temporal relationships to adverse health outcomes, unfamiliarity with vaccine-preventable diseases, and lack of trust in corporations and public health agencies. Although vaccination is a norm in the U.S. and the majority of parents vaccinate their children, many do so amid concerns.",
		title: "Vaccine Hesitancy",
	},
	{
		link: "/oa/W1983077458",
		abstract:
			"The Vaccine Adverse Event Reporting System (VAERS) is administered by the Food and Drug Administration and CDC and is a key component of postlicensure vaccine safety surveillance. Its primary function is to detect early warning signals and generate hypotheses about possible new vaccine adverse events or changes in frequency of known ones. VAERS is a passive surveillance system that relies on physicians and others to voluntarily submit reports of illness after vaccination. Manufacturers are required to report all adverse events of which they become aware. There are a number of well-described limitations of such reporting systems. These include, for example, variability in report quality, biased reporting, underreporting and the inability to determine whether a vaccine caused the adverse event in any individual report. Strengths of VAERS are that it is national in scope and timely. The information in VAERS reports is not necessarily complete nor is it verified systematically. Reports are classified as serious or nonserious based on regulatory criteria. Reports are coded by VAERS in a uniform way with a limited number of terms using a terminology called COSTART. Coding is useful for search purposes but is necessarily imprecise. VAERS is useful in detecting adverse events related to vaccines and most recently was used for enhanced reporting of adverse events in the national smallpox immunization campaign. VAERS data have always been publicly available. However, it is essential for users of VAERS data to be fully aware of the strengths and weaknesses of the system. VAERS data contain strong biases. Incidence rates and relative risks of specific adverse events cannot be calculated. Statistical significance tests and confidence intervals should be used with great caution and not routinely. Signals detected in VAERS should be subjected to further clinical and descriptive epidemiologic analysis. Confirmation in a controlled study is usually required. An understanding of the system's defined objectives and inherent drawbacks is vital to the effective use of VAERS data in vaccine safety investigations.",
		title:
			"Understanding vaccine safety information from the Vaccine Adverse Event Reporting System",
	},
	{
		link: "/oa/W2774113098",
		abstract:
			"Recent studies showing that neoantigens are crucial targets of the antitumour immune response have supported the progression of personalized cancer vaccines to clinical trials. Cancer vaccines, which are designed to amplify tumour-specific T cell responses through active immunization, have long been envisioned as a key tool of effective cancer immunotherapy. Despite a clear rationale for such vaccines, extensive past efforts were unsuccessful in mediating clinically relevant antitumour activity in humans. Recently, however, next-generation sequencing and novel bioinformatics tools have enabled the systematic discovery of tumour neoantigens, which are highly desirable immunogens because they arise from somatic mutations of the tumour and are therefore tumour specific. As a result of the diversity of tumour neoepitopes between individuals, the development of personalized cancer vaccines is warranted. Here, we review the emerging field of personalized cancer vaccination and discuss recent developments and future directions for this promising treatment strategy.",
		title:
			"Towards personalized, tumour-specific, therapeutic vaccines for cancer",
	},
	{
		link: "/oa/W2108441889",
		abstract:
			"Vaccines are among the most effective prevention tools available to clinicians. However, the success of an immunization program depends on high rates of acceptance and coverage. There is evidence of an increase in vaccine refusal in the United States and of geographic clustering of refusals that results in outbreaks. Children with exemptions from school immunization requirements (a measure of vaccine refusal) are at increased risk for measles and pertussis and can infect others who are too young to be vaccinated, cannot be vaccinated for medical reasons, or were vaccinated but did not have a sufficient immunologic response. Clinicians can play a crucial role in parental decision making. Health care providers are cited as the most frequent source of immunization information by parents, including parents of unvaccinated children. Although some clinicians have discontinued or have considered discontinuing their provider relationship with patients who refuse vaccines, the American Academy of Pediatrics Committee on Bioethics advises against this and recommends that clinicians address vaccine refusal by respectfully listening to parental concerns and discussing the risks of nonvaccination.",
		title:
			"Vaccine Refusal, Mandatory Immunization, and the Risks of Vaccine-Preventable Diseases",
	},
	{
		link: "/oa/W2904803926",
		abstract:
			"Neoantigens, which are derived from tumour-specific protein-coding mutations, are exempt from central tolerance, can generate robust immune responses1,2 and can function as bona fide antigens that facilitate tumour rejection3. Here we demonstrate that a strategy that uses multi-epitope, personalized neoantigen vaccination, which has previously been tested in patients with high-risk melanoma4-6, is feasible for tumours such as glioblastoma, which typically have a relatively low mutation load1,7 and an immunologically 'cold' tumour microenvironment8. We used personalized neoantigen-targeting vaccines to immunize patients newly diagnosed with glioblastoma following surgical resection and conventional radiotherapy in a phase I/Ib study. Patients who did not receive dexamethasone-a highly potent corticosteroid that is frequently prescribed to treat cerebral oedema in patients with glioblastoma-generated circulating polyfunctional neoantigen-specific CD4+ and CD8+ T cell responses that were enriched in a memory phenotype and showed an increase in the number of tumour-infiltrating T cells. Using single-cell T cell receptor analysis, we provide evidence that neoantigen-specific T cells from the peripheral blood can migrate into an intracranial glioblastoma tumour. Neoantigen-targeting vaccines thus have the potential to favourably alter the immune milieu of glioblastoma.",
		title:
			"Neoantigen vaccine generates intratumoral T cell responses in phase Ib glioblastoma trial",
	},
	{
		link: "/oa/W2137414914",
		abstract:
			"To examine the attitudes, beliefs, and behaviors of parents whose children were underimmunized with respect to > or =2 vaccines that have recently received negative attention, compared with parents whose children were fully immunized with respect to the recommended vaccines.Case-control study.A sample of households that participated in the National Immunization Survey were recontacted in 2001.Vaccination status was assessed. Case subjects were underimmunized with respect to > or =2 of 3 vaccines (diphtheria-tetanus-pertussis or diphtheria-tetanus-acellular pertussis, hepatitis B, or measles-containing vaccines), and control subjects were fully immunized.The response rate was 52.1% (2315 of 4440 subjects). Compared with control households, case households were more likely to make 0 dollar to 30,000 dollars (adjusted odds ratio [OR]: 2.7; 95% confidence interval [CI]: 1.5-4.6) than at least 75,000 dollars, to have > or =2 providers (OR: 2.0; 95% CI: 1.3-3.1) than 1, and to have > or =4 children (OR: 3.1; 95% CI: 1.5-6.3) than 1 child. With control for demographic and medical care factors, case subjects were more likely than control subjects to not want a new infant to receive all shots (OR: 3.8; 95% CI: 1.5-9.8), to score vaccines as unsafe or somewhat safe (OR: 2.0; 95% CI: 1.2-3.4), and to ask the doctor or nurse not to give the child a vaccine for reasons other than illness (OR: 2.7; 95% CI: 1.2-6.1). Among case subjects, 14.8% of underimmunization was attributable to parental attitudes, beliefs, and behaviors.Attitudes, beliefs, and behaviors indicative of vaccine safety concerns contribute substantially to underimmunization in the United States. Although concerns were significantly more common among parents of underimmunized children, many parents of fully immunized children demonstrated similar attitudes, beliefs, and behaviors, suggesting a risk to the currently high vaccination levels. Efforts to maintain and improve immunization coverage need to target those with attitudes/beliefs/behaviors indicative of vaccine safety concerns, as well as those with socioeconomic and health care access problems.",
		title:
			"Underimmunization Among Children: Effects of Vaccine Safety Concerns on Immunization Status",
	},
	{
		link: "/oa/W4231917180",
		abstract:
			"Vaccine hesitancy reflects concerns about the decision to vaccinate oneself or one’s children. There is a broad range of factors contributing to vaccine hesitancy, including the compulsory nature of vaccines, their coincidental temporal relationships to adverse health outcomes, unfamiliarity with vaccine-preventable diseases, and lack of trust in corporations and public health agencies. Although vaccination is a norm in the U.S. and the majority of parents vaccinate their children, many do so amid concerns. The proportion of parents claiming non-medical exemptions to school immunization requirements has been increasing over the past decade. Vaccine refusal has been associated with outbreaks of invasive Haemophilus influenzae type b disease, varicella, pneumococcal disease, measles, and pertussis, resulting in the unnecessary suffering of young children and waste of limited public health resources. Vaccine hesitancy is an extremely important issue that needs to be addressed because effective control of vaccine-preventable diseases generally requires indefinite maintenance of extremely high rates of timely vaccination. The multifactorial and complex causes of vaccine hesitancy require a broad range of approaches on the individual, provider, health system, and national levels. These include standardized measurement tools to quantify and locate clustering of vaccine hesitancy and better understand issues of trust; rapid, independent, and transparent review of an enhanced and appropriately funded vaccine safety system; adequate reimbursement for vaccine risk communication in doctors’ offices; and individually tailored messages for parents who have vaccine concerns, especially first-time pregnant women. The potential of vaccines to prevent illness and save lives has never been greater. Yet, that potential is directly dependent on parental acceptance of vaccines, which requires confidence in vaccines, healthcare providers who recommend and administer vaccines, and the systems to make sure vaccines are safe.",
		title: "Vaccine hesitancy",
	},
	{
		link: "/oa/W2326455719",
		abstract:
			"A method is described for estimating the relative incidence of clinical events in defined time intervals after vaccination compared to a control period using only data on cases. The method is derived from a Poisson cohort model by conditioning on the occurrence of an event and on vaccination histories. Methods of analysis for event-dependent vaccination histories and survival data are discussed. Asymptotic arguments suggest that the method retains high efficiency relative to the full cohort analysis under conditions which commonly apply to studies of vaccine safety.",
		title:
			"Relative Incidence Estimation from Case Series for Vaccine Safety Evaluation",
	},
	{
		link: "/oa/W2013990326",
		abstract:
			"Objective. To fill the large “gaps and limitations” in current scientific knowledge of rare vaccine adverse events identified in recent reviews of the Institute of Medicine.Methods. Computerized information on immunization, medical outcomes, and potential confounders on more than 500 000 children 0 to 6 years of age is linked annually at several health maintenance organizations to create a large cohort for multiple epidemiologic studies of vaccine safety.Results. Analysis of 3 years of follow-up data shows that 549 488 doses of diphtheria-tetanus-pertussis (DTP) and 310 618 doses of measles-mumps-rubella (MMR) vaccines have been administered to children in the study cohort. Analyses for associations between vaccines and 34 medical outcomes are underway. Screening of automated data shows that seizures are associated with receipt of DTP on the same day (relative risk [RR], 2.1; 95% confidence interval [CI], 1.1 to 4.0) and 8 to 14 days after receipt of MMR (RR, 3.0; 95% CI, 2.1 to 4.2). The diversity of vaccination exposures in this large cohort permits us to show that an apparent association of seizures 8 to 14 days after Haemophilus influenzae type b vaccine (RR, 1.6; 95% CI, 1.2 to 2.1) was attributable to confounding by simultaneous MMR vaccination; the association disappears with appropriate adjustment (RR, 1.0; 95% CI, 0.7 to 1.4).Conclusion. Preliminary design, data collection, and analytic capability of the Vaccine Safety Datalink project has been validated by replication of previous known associations between seizures and DTP and MMR vaccines. The diversity in vaccine administration schedules permits potential disentangling of effects of simultaneous and combined vaccinations. The project provides a model of public health-managed care collaborations in addition to an excellent infrastructure for safety and other studies of vaccines.",
		title:
			"Vaccine Safety Datalink Project: A New Tool for Improving Vaccine Safety Monitoring in the United States",
	},
	{
		link: "/oa/W2143216598",
		abstract:
			"Despite being recognized as one of the most successful public health measures, vaccination is perceived as unsafe and unnecessary by a growing number of parents. Anti-vaccination movements have been implicated in lowered vaccine acceptance rates and in the increase in vaccine-preventable disease outbreaks and epidemics. In this review, we will look at determinants of parental decision-making about vaccination and provide an overview of the history of anti-vaccination movements and its clinical impact.",
		title:
			"Vaccine hesitancy, vaccine refusal and the anti-vaccine movement: influence, impact and implications",
	},
	{
		link: "/oa/W2298630271",
		abstract:
			"Parents hesitant to vaccinate their children may delay routine immunizations or seek exemptions from state vaccine mandates. Recent outbreaks of vaccine-preventable diseases in the United States have drawn attention to this phenomenon. Improved understanding of the association between vaccine refusal and the epidemiology of these diseases is needed.To review the published literature to evaluate the association between vaccine delay, refusal, or exemption and the epidemiology of measles and pertussis, 2 vaccine-preventable diseases with recent US outbreaks.Search of PubMed through November 30, 2015, for reports of US measles outbreaks that have occurred since measles was declared eliminated in the United States (after January 1, 2000), endemic and epidemic pertussis since the lowest point in US pertussis incidence (after January 1, 1977), and for studies that assessed disease risk in the context of vaccine delay or exemption.We identified 18 published measles studies (9 annual summaries and 9 outbreak reports), which described 1416 measles cases (individual age range, 2 weeks-84 years; 178 cases younger than 12 months) and more than half (56.8%) had no history of measles vaccination. Of the 970 measles cases with detailed vaccination data, 574 cases were unvaccinated despite being vaccine eligible and 405 (70.6%) of these had nonmedical exemptions (eg, exemptions for religious or philosophical reasons, as opposed to medical contraindications; 41.8% of total). Among 32 reports of pertussis outbreaks, which included 10,609 individuals for whom vaccination status was reported (age range, 10 days-87 years), the 5 largest statewide epidemics had substantial proportions (range, 24%-45%) of unvaccinated or undervaccinated individuals. However, several pertussis outbreaks also occurred in highly vaccinated populations, indicating waning immunity. Nine reports (describing 12 outbreaks) provided detailed vaccination data on unimmunized cases; among 8 of these outbreaks from 59% through 93% of unvaccinated individuals were intentionally unvaccinated.A substantial proportion of the US measles cases in the era after elimination were intentionally unvaccinated. The phenomenon of vaccine refusal was associated with an increased risk for measles among people who refuse vaccines and among fully vaccinated individuals. Although pertussis resurgence has been attributed to waning immunity and other factors, vaccine refusal was still associated with an increased risk for pertussis in some populations.",
		title:
			"Association Between Vaccine Refusal and Vaccine-Preventable Diseases in the United States",
	},
	{
		link: "/oa/W2794683609",
		abstract:
			"In order to gather a global picture of vaccine hesitancy and whether/how it is changing, an analysis was undertaken to review three years of data available as of June 2017 from the WHO/UNICEF Joint Report Form (JRF) to determine the reported rate of vaccine hesitancy across the globe, the cited reasons for hesitancy, if these varied by country income level and/or by WHO region and whether these reasons were based upon an assessment. The reported reasons were classified using the Strategic Advisory Group of Experts (SAGE) on Immunization matrix of hesitancy determinants (www.who.int/immunization/sage/meetings/2014/october/SAGE_working_group_revised_report_vaccine_hesitancy.pdf). Hesitancy was common, reported by >90% of countries. The list of cited reasons was long and covered 22 of 23 WHO determinants matrix categories. Even the most frequently cited category, risk- benefit (scientific evidence e.g. vaccine safety concerns), accounted for less than one quarter of all reasons cited. The reasons varied by country income level, by WHO region and over time and within a country. Thus based upon this JRF data, across the globe countries appear to understand the SAGE vaccine hesitancy definition and use it to report reasons for hesitancy. However, the rigour of the cited reasons could be improved as only just over 1/3 of countries reported that their reasons were assessment based, the rest were opinion based. With respect to any assessment in the previous five years, upper middle income countries were the least likely to have done an assessment. These analyses provided some of the evidence for the 2017 Assessment Report of the Global Vaccine Action Plan recommendation that each country develop a strategy to increase acceptance and demand for vaccination, which should include ongoing community engagement and trust-building, active hesitancy prevention, regular national assessment of vaccine concerns, and crisis response planning (www.who.int/immunization/sage/meetings/2017/october/1_GVAP_Assessment_report_web_version.pdf).",
		title:
			"Vaccine hesitancy around the globe: Analysis of three years of WHO/UNICEF Joint Reporting Form data-2015–2017",
	},
	{
		link: "/oa/W2109057963",
		abstract:
			"This report updates the 2008 recommendations by CDC's Advisory Committee on Immunization Practices (ACIP) regarding the use of influenza vaccine for the prevention and control of seasonal influenza (CDC. Prevention and control of influenza: recommendations of the Advisory Committee on Immunization Practices [ACIP]. MMWR 2008;57[No. RR-7]). Information on vaccination issues related to the recently identified novel influenza A H1N1 virus will be published later in 2009. The 2009 seasonal influenza recommendations include new and updated information. Highlights of the 2009 recommendations include 1) a recommendation that annual vaccination be administered to all children aged 6 months-18 years for the 2009-10 influenza season; 2) a recommendation that vaccines containing the 2009-10 trivalent vaccine virus strains A/Brisbane/59/2007 (H1N1)-like, A/Brisbane/10/2007 (H3N2)-like, and B/Brisbane/60/2008-like antigens be used; and 3) a notice that recommendations for influenza diagnosis and antiviral use will be published before the start of the 2009-10 influenza season. Vaccination efforts should begin as soon as vaccine is available and continue through the influenza season. Approximately 83% of the United States population is specifically recommended for annual vaccination against seasonal influenza; however, <40% of the U.S. population received the 2008-09 influenza vaccine. These recommendations also include a summary of safety data for U.S. licensed influenza vaccines. These recommendations and other information are available at CDC's influenza website (http://www.cdc.gov/flu); any updates or supplements that might be required during the 2009-10 influenza season also can be found at this website. Vaccination and health-care providers should be alert to announcements of recommendation updates and should check the CDC influenza website periodically for additional information.",
		title:
			"Prevention and control of seasonal influenza with vaccines: recommendations of the Advisory Committee on Immunization Practices (ACIP), 2009.",
	},
	{
		link: "/oa/W2510383356",
		abstract:
			"Healthcare workers (HCWs) are often referred to as the most trusted source of vaccine-related information for their patients. However, the evidence suggests that a number of HCWs are vaccine-hesitant. This study consists of 65 semi-structured interviews with vaccine providers in Croatia, France, Greece, and Romania to investigate concerns HCWs might have about vaccination. The results revealed that vaccine hesitancy is present in all four countries among vaccine providers. The most important concern across all countries was the fear of vaccine side effects. New vaccines were singled out due to perceived lack of testing for vaccine safety and efficacy. Furthermore, while high trust in health authorities was expressed by HCWs, there was also strong mistrust of pharmaceutical companies due to perceived financial interests and lack of communication about side effects. The notion that it is a doctor's responsibility to respond to hesitant patients was reported in all countries. Concerns were also seen to be country- and context-specific. Strategies to improve confidence in vaccines should be adapted to the specific political, social, cultural and economic context of countries. Furthermore, while most interventions focus on education and improving information about vaccine safety, effectiveness, or the need for vaccines, concerns raised in this study identify other determinants of hesitancy that need addressing. The representativeness of the views of the interviewed HCWs must be interpreted with caution. This a qualitative study with a small sample size that included geographical areas where vaccination uptake was lower or where hesitancy was more prevalent and it reflects individual participants' beliefs and attitudes toward the topic. As HCWs have the potential of influencing patient vaccination uptake, it is crucial to improve their confidence in vaccination and engage them in activities targeting vaccine hesitancy among their patients.",
		title:
			"Vaccine hesitancy among healthcare workers in Europe: A qualitative study",
	},
];

vi.mock("@/app/api/bot/answer-engine/model", async (importOriginal) => {
	return {
		model: function MockedModel() {
			const functionCallMessage = {
				lc_serializable: true,
				lc_kwargs: {
					content: "",
					additional_kwargs: {
						function_call: {
							name: "constructSearchParameters",
							arguments:
								'{"keyConcept":"dreaming","relatedConcepts":["REM sleep","neuroscience","psychology","cognition","consciousness"]}',
						},
						tool_calls: undefined,
					},
				},
				lc_namespace: ["langchain_core", "messages"],
				content: "",
				name: undefined,
				additional_kwargs: {
					function_call: {
						name: "constructSearchParameters",
						arguments:
							'{"keyConcept":"dreaming","relatedConcepts":["REM sleep","neuroscience","psychology","cognition","consciousness"]}',
					},
					tool_calls: undefined,
				},
			};

			return functionCallMessage;
		},
	};
});

vi.mock("../../paper-search/search", async (importOriginal) => {
	return {
		fetchPapers: async function MockedFetchPapers() {
			return MOCKED_PAPER_RESPONSE;
		},
	};
});
describe("AnswerEngineMemory", () => {
	beforeEach(() => {
		// Setup code before each test
		// messageMemory.clear();
	});

	afterEach(() => {
		// Teardown code after each test
	});

	// it("should do something", async () => {
	//   await messageMemory.chatHistory.addMessage(new HumanMessage("Hi!"));
	//   await messageMemory.chatHistory.addMessage(new AIMessage("What's up?"));

	//   const memory = await messageMemory.loadMemoryVariables({});
	//   expect(memory).toBe(false);
	// });

	// it("should do something else", async () => {
	//   const messages = [new HumanMessage("Hi!"), new AIMessage("What's up?")];
	//   const storedMessages = mapChatMessagesToStoredMessages(messages); //?

	//   expect(storedMessages).toBe(false);
	// });

	it("fetch papers chain", async () => {
		const question = "What is the meaning of life?";
		console.log(question);
		const response = await fetchPapersChain.invoke({ question });
		// const test = await fetchPapersChain.invoke(question);
		console.log(response);

		expect(response).toBe(true);
	});
});
