import { PaperIdEvaluator } from "@/app/llm/evaluators/select-paper-evaluators";

const MOCKED_PAPERS = [
	{
		title:
			"Does fish oil lower blood pressure? A meta-analysis of controlled trials.",
		link: "/oa/W2148818926",
		abstract:
			'BACKGROUND In a meta-analysis of 31 placebo-controlled trials on 1356 subjects, we examined the effect of omega-3 fatty acids in fish oil on blood pressure by grouping studies that were similar in fish oil dose, length of treatment, health of the subjects, or study design. METHODS AND RESULTS The mean reduction in blood pressure caused by fish oil for the 31 studies was -3.0/-1.5 mm Hg (95% confidence intervals: systolic blood pressure: -4.5, -1.5; diastolic blood pressure: -2.2, -0.8). There was a statistically significant dose-response effect when studies were grouped by omega-3 fatty acid dose: -1.3/-0.7 mm Hg at doses &lt; or = 3 g/d, -2.9/-1.6 mm Hg at 3.3 to 7 g/d, and -8.1/-5.8 mm Hg at 15 g/d. Both eicosapentaenoic acid and docosahexaenoic acid were significantly related to blood pressure response. There was no effect on blood pressure in eight studies of "healthy" persons (mean reduction, -0.4/-0.7 mm Hg) at an overall mean dose of 4.2 g omega-3 fatty acids/d. By contrast, there was a significant effect of -3.4/-2.0 mm Hg in the group of hypertensive studies with a mean fish oil dose of 5.6 g/d and on systolic blood pressure only in six studies of hypercholesterolemic patients (-4.4/-1.1 mm Hg) with a mean dose of 4.0 g/d. A nonsignificant decrease in blood pressure was observed in four studies of patients with atherosclerotic cardiovascular disease (-6.3/-2.9 mm Hg). Variations in the length of treatment (from 3 to 24 weeks), type of placebo, and study design (crossover or parallel groups) did not appear to account for inconsistent findings among studies. CONCLUSIONS There is a dose-response effect of fish oil on blood pressure of -0.66/-0.35 mm Hg/g omega-3 fatty acids. The hypotensive effect may be strongest in hypertensive subjects and those with clinical atherosclerotic disease or hypercholesterolemia.',
		id: "/oa/W2148818926",
	},
	{
		title:
			"Fish Consumption, Fish Oil, Omega-3 Fatty Acids, and Cardiovascular Disease",
		link: "/oa/W2169087826",
		abstract:
			"HomeArteriosclerosis, Thrombosis, and Vascular BiologyVol. 23, No. 2Fish Consumption, Fish Oil, Omega-3 Fatty Acids, and Cardiovascular Disease",
		id: "/oa/W2169087826",
	},
	{
		title:
			"Fish Oil Prevents Insulin Resistance Induced by High-Fat Feeding in Rats",
		link: "/oa/W1975200587",
		abstract:
			"Non-insulin-dependent diabetes mellitus is an increasingly prevalent disease in Western and developing societies. A major metabolic abnormality of non-insulin-dependent diabetes is impaired insulin action (insulin resistance). Diets high in fat from vegetable and nonaquatic animal sources (rich in linoleic acid, an omega-6 fatty acid, and saturated fats) lead to insulin resistance. In rats fed high-fat diets, replacement of only 6 percent of the linoleic omega-6 fatty acids from safflower oil with long-chain polyunsaturated omega-3 fatty acids from fish oil prevented the development of insulin resistance. The effect was most pronounced in the liver and skeletal muscle, which have important roles in glucose supply and demand. The results may be important for therapy or prevention of non-insulin-dependent diabetes mellitus.",
		id: "/oa/W1975200587",
	},
	{
		title:
			"Fish oil and omega-3 fatty acids in cardiovascular disease: do they really work?",
		link: "/oa/W2130735505",
		abstract:
			"Omega-3 fatty acids, which are found abundantly in fish oil, exert pleiotropic cardiometabolic effects with a diverse range of actions. The results of previous studies raised a lot of interest in the role of fish oil and omega-3 fatty acids in primary and secondary prevention of cardiovascular diseases. The present review will focus on the current clinical uses of omega-3 fatty acids and provide an update on their effects. Since recently published trials in patients with coronary artery diseases or post-myocardial infarction did not show an effect of omega-3 fatty acids on major cardiovascular endpoints, this review will examine the limitations of those data and suggest recommendations for the use of omega-3 fatty acids.",
		id: "/oa/W2130735505",
	},
	{
		title:
			"Reversal of Parenteral Nutrition–Associated Liver Disease in Two Infants With Short Bowel Syndrome Using Parenteral Fish Oil: Implications for Future Management",
		link: "/oa/W2015480392",
		abstract:
			"Here we report the reversal of cholestasis in 2 infants with intestinal failure and parenteral nutrition–associated liver disease. Treatment involved the substitution of a conventional intravenous fat emulsion with one containing primarily omega-3 fatty acids. Biochemical tests of liver function improved significantly. One child was removed from the liver transplantation list because of improved hepatic function, and the second child had complete resolution of cholestasis while solely on parenteral nutrition. This suggests that fat emulsions made from fish oils may be an effective means of treating and preventing this often-fatal condition. A randomized, controlled trial is necessary to study the efficacy of this new approach to parenteral nutrition–associated liver disease.",
		id: "/oa/W2015480392",
	},
	{
		title:
			"Suppression by diets rich in fish oil of very low density lipoprotein production in man.",
		link: "/oa/W2053731083",
		abstract:
			"The highly polyunsaturated fatty acids in fish oils lower the plasma triglyceride concentration. We have studied the effect of a diet rich in fish oil on the rate of production of the triglyceride-transporting very low density lipoprotein (VLDL). Seven subjects, five normal and two with hypertriglyceridemia received up to 30% of daily energy needs from a fish oil preparation that was rich in eicosapentaenoic acid and docosahexaenoic acid, omega-3 fatty acids with five and six double bonds, respectively. Compared with a diet similarly enriched with safflower oil (in which the predominant fatty acid is the omega-6 linoleic acid, with two double bonds), the fish oil diet lowered VLDL lipids and B apoprotein concentrations profoundly. High density lipoprotein lipids and A1 apoprotein were also lowered, but the effect on low density lipoprotein (LDL) concentration was inconsistent. The daily production or flux of VLDL apoprotein B, calculated from reinjected autologous 125I-labeled lipoprotein, was substantially less in six subjects studied after 3 wk of fish oil, compared with after safflower oil. This effect on flux was more consistent than that on the irreversible fractional removal rate, which was increased in the four normolipidemic but inconsistent in the hypertriglyceridemic subjects. This suggests that fish oil reduced primarily the production of VLDL. The daily production of VLDL triglyceride, calculated from the kinetics of the triglyceride specific radioactivity-time curves after [3H]glycerol was injected, also showed very substantial reductions in five subjects studied. The marked suppression in VLDL apoprotein B and VLDL triglyceride formation was found not to be due to diminished plasma total free fatty acid or plasma eicosapentaenoic flux, calculated during constant infusions of [14C]eicosapentaenoic acid and [3H]oleic acid in four subjects. In two subjects there was presumptive evidence for substantial independent influx of LDL during the fish oil diet, based on the precursor-product relationship between the intermediate density lipoprotein and LDL apoprotein B specific radioactivity-time curves.",
		id: "/oa/W2053731083",
	},
	{
		title:
			"Decreased oxidative stress in patients with ulcerative colitis supplemented with fish oil ω-3 fatty acids",
		link: "/oa/W2165974502",
		abstract:
			"The potential pathogenicity of free radicals may have a pivotal role in ulcerative colitis. Fish oil omega-3 fatty acids exert anti-inflammatory effects on patients with ulcerative colitis (UC), but the precise mechanism of the action of fish oil on oxidative stress is still controversial. The aim of the present work was to verify the blood oxidative stress in patients with UC and determine whether the association of sulfasalazine to fish oil omega-3 fatty acids is more effective than isolated use of sulfasalazine to reduce the oxidative stress.Nine patients (seven female and two male; mean age = 40 +/- 11 y) with mild or moderate active UC were studied in a randomized crossover design. In addition to their usual medication (2 g/d of sulfasalazine), they received fish oil omega-3 fatty acids (4.5 g/d) or placebo for 2-mo treatment periods that were separated by 2 mo, when they only received sulfasalazine. Nine healthy individuals served as control subjects to study the oxidative stress status. Disease activity was assessed by laboratory indicators (C-reactive protein, alpha1-acid glycoprotein, alpha1-antitrypsin, erythrocyte sedimentation rate, albumin, hemoglobin, and platelet count), sigmoidoscopy, and histology scores. Analysis of oxidative stress was assessed by plasma chemiluminescence and erythrocyte lipid peroxidation, both induced by tert butyl hydroperoxide (t-BuOOH) and by plasma malondialdehyde. Antioxidant status was assayed by total plasma antioxidant capacity (TRAP) and microsomal lipid peroxidation inhibition (LPI). Superoxide dismutase (SOD) and catalase erythrocyte enzymatic activities were also determined.No significant changes were observed in any laboratory indicator or in the sigmoidoscopy or histology scores, with the exception of erythrocyte sedimentation rate, which decreased with both treatments. Oxidative stress was demonstrated by significant decreases in TRAP and LPI levels, increased chemiluminescence induced by t-BuOOH, and higher SOD activity in patients with UC. Treatment with fish oil omega-3 fatty acids reverted the chemiluminescence induced by t-BuOOH and LPI to baseline levels but that did not occur when patients received only sulfasalazine. Levels of plasma malondialdehyde, erythrocyte lipid peroxidation, and catalase were not different from those in the control group.The results indicated that plasma oxidative stress occurs in patients with UC, and there was a significant decrease when the patients used sulfasalazine plus fish oil omega-3 fatty acids.",
		id: "/oa/W2165974502",
	},
	{
		title:
			"Bioequivalence of encapsulated and microencapsulated fish-oil supplementation",
		link: "/oa/W2129102966",
		abstract:
			"Omega-3 oil from fish can be stabilised against oxidation using a variety of microencapsulation technologies. Complex coacervation has been used and found to be commercially useful for fortifying foods and beverages with long-chain omega-3 containing oils. Here we report a comparative human bioavailability study of microencapsulated omega-3 fish oil and standard fish-oil soft-gel capsules. Phospholipid levels of long-chain omega-3 fatty acids increased equivalently in both subjects groups. Also, triacylglycerol levels were reduced similarly in both groups. These results indicate that omega-3 fatty acids have equivalent bioavailability when delivered as microencapsulated complex coacervates or as soft-gel capsules.",
		id: "/oa/W2129102966",
	},
	{
		title:
			"Dietary fish oil and olive oil supplementation in patients with Rheumatoid Arthritis clinical and immunologic effects",
		link: "/oa/W2138577332",
		abstract:
			"Abstract Forty‐nine patients with active rheumatoid arthritis completed a 24‐week, prospective, double‐blind, randomized study of dietary supplementation with 2 different dosages of fish oil and 1 dosage of olive oil. Clinical evaluations were performed at baseline and every 6 weeks thereafter, and immunologic variables were measured at baseline and after 24 weeks of study. The 3 groups of patients were matched for age, sex, disease severity, and use of disease‐modifying antirheumatic drugs (DMARDs). Subjects continued receiving DMARDs and other background medications without change during the study. Twenty patients consumed daily dietary supplements of n3 fatty acids containing 27 mg/kg eicosapentaenoic acid (EPA) and 18 mg/kg docosahexaenoic acid (DHA) (low dose), 17 patients ingested 54 mg/kg EPA and 36 mg/kg DHA (high dose), and 12 patients ingested olive oil capsules containing 6.8 gm of oleic acid. Significant improvements from baseline in the number of tender joints were noted in the low‐dose group at week 24 ( P = 0.05) and in the high‐dose group at weeks 18 ( P = 0.04) and 24 ( P = 0.02). Significant decreases from baseline in the number of swollen joints were noted in the low‐dose group at weeks 12 ( P = 0.003), 18 ( P = 0.002), and 24 ( P = 0.001) and in the high‐dose group at weeks 12 ( P = 0.0001), 18 ( P = 0.008), and 24 ( P = 0.02). A total of 5 of 45 clinical measures were significantly changed from baseline in the olive oil group, 8 of 45 in the low‐dose fish oil group, and 21 of 45 in the high‐dose fish oil group during the study ( P = 0.0002). Neutrophil leukotriene B 4 production decreased by 19% from baseline in the low‐dose fish oil group ( P = 0.0003) and 20% in the high‐dose group ( P = 0.03), while macrophage interleukin‐1 production decreased by 38.5% in the olive oil group ( P not significant), 40.6% in the low‐dose group ( P = 0.06), and 54.7% in the high‐dose group ( P = 0.0005). Tritiated thymidine incorporation in peripheral blood mononuclear cells after stimulation with concanavalin A increased significantly in all 3 groups after 24 weeks, compared with baseline values.",
		id: "/oa/W2138577332",
	},
	{
		title:
			"Effect of Fish Oil on Ventricular Tachyarrhythmia and Death in Patients With Implantable Cardioverter Defibrillators",
		link: "/oa/W2099831545",
		abstract:
			"Very-long-chain n-3 polyunsaturated fatty acids (omega-3 PUFAs) from fish are thought to reduce risk of sudden death, possibly by reducing susceptibility to cardiac arrhythmia.To study the effect of supplemental fish oil vs placebo on ventricular tachyarrhythmia or death.The Study on Omega-3 Fatty acids and ventricular Arrhythmia (SOFA) was a randomized, parallel, placebo-controlled, double-blind trial conducted at 26 cardiology clinics across Europe. A total of 546 patients with implantable cardioverter-defibrillators (ICDs) and prior documented malignant ventricular tachycardia (VT) or ventricular fibrillation (VF) were enrolled between October 2001 and August 2004. Patients were randomly assigned to receive 2 g/d of fish oil (n = 273) or placebo (n = 273) for a median period of 356 days (range, 14-379 days).Appropriate ICD intervention for VT or VF, or all-cause death.The primary end point occurred in 81 (30%) patients taking fish oil vs 90 (33%) patients taking placebo (hazard ratio [HR], 0.86; 95% confidence interval [CI], 0.64-1.16; P = .33). In prespecified subgroup analyses, the HR was 0.91 (95% CI, 0.66-1.26) for fish oil vs placebo in the 411 patients who had experienced VT in the year before the study, and 0.76 (95% CI, 0.52-1.11) for 332 patients with prior myocardial infarctions.Our findings do not indicate evidence of a strong protective effect of intake of omega-3 PUFAs from fish oil against ventricular arrhythmia in patients with ICDs.clinicaltrials.gov Identifier: NCT00110838.",
		id: "/oa/W2099831545",
	},
	{
		title:
			"Evaluation of the effects of dietary supplementation with fish oil omega-3 fatty acids on weight bearing in dogs with osteoarthritis",
		link: "/oa/W2121421075",
		abstract:
			"To evaluate the effects of a food supplemented with fish oil omega-3 fatty acids on weight bearing in dogs with osteoarthritis.Randomized, double-blinded, controlled clinical trial.38 client-owned dogs with osteoarthritis examined at 2 university veterinary clinics.Dogs were randomly assigned to receive a typical commercial food (n = 16) or a test food (22) containing 3.5% fish oil omega-3 fatty acids. On day 0 (before the trial began) and days 45 and 90 after the trial began, investigators conducted orthopedic evaluations and force-plate analyses of the most severely affected limb of each dog, and owners completed questionnaires to characterize their dogs' arthritis signs.The change in mean peak vertical force between days 90 and 0 was significant for the test-food group (5.6%) but not for the control-food group (0.4%). Improvement in peak vertical force values was evident in 82% of the dogs in the test-food group, compared with 38% of the dogs in the control-food group. In addition, according to investigators' subjective evaluations, dogs fed the test food had significant improvements in lameness and weight bearing on day 90, compared with measurements obtained on day 0.At least in the short term, dietary supplementation with fish oil omega-3 fatty acids resulted in an improvement in weight bearing in dogs with osteoarthritis.",
		id: "/oa/W2121421075",
	},
	{
		title: "Fish oil — How does it reduce plasma triglycerides?",
		link: "/oa/W2088359261",
		abstract:
			"Long chain omega-3 fatty acids (FAs) are effective for reducing plasma triglyceride (TG) levels. At the pharmaceutical dose, 3.4 g/day, they reduce plasma TG by about 25–50% after one month of treatment, resulting primarily from the decline in hepatic very low density lipoprotein (VLDL-TG) production, and secondarily from the increase in VLDL clearance. Numerous mechanisms have been shown to contribute to the TG overproduction, but a key component is an increase in the availability of FAs in the liver. The liver derives FAs from three sources: diet (delivered via chylomicron remnants), de novo lipogenesis, and circulating non-esterified FAs (NEFAs). Of these, NEFAs contribute the largest fraction to VLDL-TG production in both normotriglyceridemic subjects and hypertriglyceridemic, insulin resistant patients. Thus reducing NEFA delivery to the liver would be a likely locus of action for fish oils (FO). The key regulator of plasma NEFA is intracellular adipocyte lipolysis via hormone sensitive lipase (HSL), which increases as insulin sensitivity worsens. FO counteracts intracellular lipolysis in adipocytes by suppressing adipose tissue inflammation. In addition, FO increases extracellular lipolysis by lipoprotein lipase (LpL) in adipose, heart and skeletal muscle and enhances hepatic and skeletal muscle β-oxidation which contributes to reduced FA delivery to the liver. FO could activate transcription factors which control metabolic pathways in a tissue specific manner regulating nutrient traffic and reducing plasma TG. This article is part of a Special Issue entitled Triglyceride Metabolism and Disease.",
		id: "/oa/W2088359261",
	},
	{
		title:
			"Quality enhancement in fresh and frozen lingcod (Ophiodon elongates) fillets by employment of fish oil incorporated chitosan coatings",
		link: "/oa/W2057319832",
		abstract:
			"The 3% chitosan solutions incorporating 10% fish oil (w/w chitosan, containing 91.2% EPA and DHA) with or without the addition of 0.8% vitamin E were prepared. Fresh lingcod (Ophiodon elongates) fillets were vacuum-impregnated in coating solution at 100 mm Hg for 10 min followed by atmospheric restoration for 15 min, dried, and then stored at 2 °C or −20 °C for 3-weeks and 3-months, respectively, for physicochemical and microbial quality evaluation. Chitosan–fish oil coating increased total lipid and omega-3 fatty acid contents of fish by about 3-fold, reduced TBARS values in both fresh and frozen samples, and also decreased drip loss of frozen samples by 14.1–27.6%. Chitosan coatings resulted in 0.37–1.19 and 0.27–1.55 log CFU/g reductions in total plate and psychrotrophic counts in cold stored and frozen stored samples, respectively. Chitosan–fish oil coatings may be used to extend shelf-life and fortify omega-3 fatty acid in lean fish.",
		id: "/oa/W2057319832",
	},
	{
		title:
			"Oxidized omega-3 fatty acids in fish oil inhibit leukocyte-endothelial interactions through activation of PPARα",
		link: "/oa/W2062476040",
		abstract:
			"Omega-3 fatty acids, which are abundant in fish oil, improve the prognosis of several chronic inflammatory diseases although the mechanism for such effects remains unclear. These fatty acids, such as eicosapentaenoic acid (EPA), are highly polyunsaturated and readily undergo oxidation. We show that oxidized, but not native unoxidized, EPA significantly inhibited human neutrophil and monocyte adhesion to endothelial cells in vitro by inhibiting endothelial adhesion receptor expression. In transcriptional coactivation assays, oxidized EPA potently activated the peroxisome proliferator-activated receptor α (PPARα), a member of the nuclear receptor family. In vivo, oxidized, but not native, EPA markedly reduced leukocyte rolling and adhesion to venular endothelium of lipopolysaccharide (LPS)–treated mice. This occurred via a PPARα-dependent mechanism because oxidized EPA had no such effect in LPS-treated PPARα-deficient mice. Therefore, the beneficial effects of omega-3 fatty acids may be explained by a PPARα-mediated anti-inflammatory effect of oxidized EPA.",
		id: "/oa/W2062476040",
	},
	{
		title:
			"Role of Continuous Phase Protein on the Oxidative Stability of Fish Oil-in-Water Emulsions",
		link: "/oa/W1990584102",
		abstract:
			"Whey protein isolate (WPI), soy protein isolate (SPI), and sodium caseinate (CAS) can inhibit lipid oxidation when they produce a positive charge at the interface of emulsion droplets. However, when proteins are used to stabilize oil-in-water emulsions, only a fraction of them actually absorb to the emulsion droplets, with the rest remaining in the continuous phase. The impact of these continuous phase proteins on the oxidative stability of protein-stabilized emulsions is not well understood. WPI-stabilized menhaden oil-in-water emulsions were prepared by high-pressure homogenization. In some experiments WPI was removed from the continuous phase of the emulsions through repeated centrifugation and resuspension of the emulsion droplets (washed emulsion). Unwashed emulsions were more oxidatively stable than washed emulsions at pH 7.0, suggesting that continuous phase proteins were antioxidative. The oxidative stability of emulsions containing different kinds of protein in the continuous phase decreased in the order SPI > CAS > WPI, as determined by both hydroperoxide and headspace propanal formation. Iron-binding studies showed that the chelating ability of the proteins decreased in the order CAS > SPI > WPI. The free sulfhydryls of both WPI and SPI were involved in their antioxidant activity. This research shows that continuous phase proteins could be an effective means of protecting omega-3 fatty acids from oxidative deterioration.",
		id: "/oa/W1990584102",
	},
	{
		title: "Fish Oil for the Treatment of Cardiovascular Disease",
		link: "/oa/W2036364822",
		abstract:
			"Omega-3 fatty acids, which are found abundantly in fish oil, are increasingly being used in the management of cardiovascular disease. It is clear that fish oil, in clinically used doses (typically 4 g/d of eicosapentaenoic acid and docosahexaenoic acid) reduce high triglycerides. However, the role of omega-3 fatty acids in reducing mortality, sudden death, arrhythmias, myocardial infarction, and heart failure has not yet been established. This review will focus on the current clinical uses of fish oil and provide an update on their effects on triglycerides, coronary artery disease, heart failure, and arrhythmia. We will explore the dietary sources of fish oil as compared with drug therapy, and discuss the use of fish oil products in combination with other commonly used lipid-lowering agents. We will examine the underlying mechanism of fish oil's action on triglyceride reduction, plaque stability, and effect in diabetes, and review the newly discovered anti-inflammatory effects of fish oil. Finally, we will examine the limitations of current data and suggest recommendations for fish oil use.",
		id: "/oa/W2036364822",
	},
	{
		title:
			"Effects of high-dose fish oil on rheumatoid arthritis after stopping nonsteroidal antiinflammatory drugs clinical and immune correlates",
		link: "/oa/W2046810878",
		abstract:
			"To determine the following: 1) whether dietary supplementation with fish oil will allow the discontinuation of nonsteroidal antiinflammatory drugs (NSAIDs) in patients with rheumatoid arthritis (RA); 2) the clinical efficacy of high-dose dietary omega 3 fatty acid fish oil supplementation in RA patients; and 3) the effect of fish oil supplements on the production of multiple cytokines in this population.Sixty-six RA patients entered a double-blind, placebo-controlled, prospective study of fish oil supplementation while taking diclofenac (75 mg twice a day). Patients took either 130 mg/kg/day of omega 3 fatty acids or 9 capsules/day of corn oil. Placebo diclofenac was substituted at week 18 or 22, and fish oil supplements were continued for 8 weeks (to week 26 or 30). Serum levels of interleukin-1 beta (IL-1 beta), IL-2, IL-6, and IL-8 and tumor necrosis factor alpha were measured by enzyme-linked immunosorbent assay at baseline and during the study.In the group taking fish oil, there were significant decreases from baseline in the mean (+/- SEM) number of tender joints (5.3 +/- 0.835; P < 0.0001), duration of morning stiffness (-67.7 +/- 23.3 minutes; P = 0.008), physician's and patient's evaluation of global arthritis activity (-0.33 +/- 0.13; P = 0.017 and -0.38 +/- 0.17; P = 0.036, respectively), and physician's evaluation of pain (-0.38 +/- 0.12; P = 0.004). In patients taking corn oil, no clinical parameters improved from baseline. The decrease in the number of tender joints remained significant 8 weeks after discontinuing diclofenac in patients taking fish oil (-7.8 +/- 2.6; P = 0.011) and the decrease in the number of tender joints at this time was significant compared with that in patients receiving corn oil (P = 0.043). IL-1 beta decreased significantly from baseline through weeks 18 and 22 in patients consuming fish oil (-7.7 +/- 3.1; P = 0.026).Patients taking dietary supplements of fish oil exhibit improvements in clinical parameters of disease activity from baseline, including the number of tender joints, and these improvements are associated with significant decreases in levels of IL-1 beta from baseline. Some patients who take fish oil are able to discontinue NSAIDs without experiencing a disease flare.",
		id: "/oa/W2046810878",
	},
	{
		title:
			"Physicochemical characterization and oxidative stability of fish oil encapsulated in an amorphous matrix containing trehalose",
		link: "/oa/W1977818136",
		abstract:
			"Fish oil with 33% omega-3 fatty acids was microencapsulated by spray-drying in a matrix of n-octenylsuccinate-derivatized starch and either glucose syrup or trehalose. Samples showed no difference in physicochemical properties as determined by measurement of particle size, oil droplet size, true density and BET surface. Upon storage at low relative humidity, lipid oxidation was decreased in trehalose containing samples indicating that in the amorphous state trehalose is a more suitable wall material for microencapsulation than glucose syrup. The retarded oxidation of trehalose containing samples may be attributed to the unique binding properties of trehalose to dienes. At 54% relative humidity, a rapid oxidation of the microencapsulated oil was observed upon crystallization of trehalose, which limits the range of applications to products to be stored at low humidity.",
		id: "/oa/W1977818136",
	},
	{
		title:
			"Double-blind, randomized, controlled trial of fish oil supplements in prevention of recurrence of stenosis after coronary angioplasty.",
		link: "/oa/W2058598807",
		abstract:
			"Previous studies suggest that recurrence of coronary stenosis after percutaneous transluminal coronary angioplasty (PTCA) might be prevented with dietary supplements rich in omega-3 fatty acids. The purpose of the present study was to evaluate this hypothesis. In addition, the relation between usual dietary consumption of omega-3 fatty acids and restenosis was assessed.A double-blind, randomized, controlled trial was conducted in which 205 patients undergoing a first PTCA received 15 capsules per day containing 1 g of either fish oil (2.7 g/day of eicosapentaenoic acid, 1.8 g/day of docosahexaenoic acid) or olive oil. The treatment was started 3 weeks before PTCA and continued for 6 months thereafter. Dietary intake was assessed by food frequency questionnaire. At 6 months after PTCA, patients underwent a control angiography. All angiographic lesions were measured by quantitative computer analysis. Four criteria were used to define restenosis. Restenosis occurred less often in the fish oil group (22.0-35.6% depending on the definition) than in the control group (40.0-53.3%). After controlling for other risk factors of restenosis, the association of fish oil supplementation with a lower frequency of restenosis was statistically significant (p = 0.03) for three of four definitions. After adjustment, a dietary intake of omega-3 fatty acids of more than 0.15 g/day was also associated with a lower frequency of restenosis (p less than or equal to 0.03).This trial documented the protective effect of fish oil supplements on the recurrence of coronary stenosis 6 months after PTCA. The study results suggest that a dietary intervention could be useful in preventing restenosis.",
		id: "/oa/W2058598807",
	},
	{
		title:
			"Maintenance of remission in inflammatory bowel disease using omega-3 fatty acids (fish oil): A systematic review and meta-analyses",
		link: "/oa/W2084138571",
		abstract:
			"The objective was to systematically review the efficacy and safety of n-3 (omega-3 fatty acids, fish oil) for maintaining remission in Crohn's disease (CD) and ulcerative colitis (UC). Electronic databases were searched systematically for randomized controlled trials of n-3 for maintenance of remission in inflammatory bowel disease (IBD). Studies of patients of any age group who were in remission at the time of recruitment and were followed for at least 6 months were included. The primary outcome was relapse rate at the end of the follow-up period. Nine studies were eligible for inclusion; six studies of CD (n = 1039) and three of UC (n = 138). There was a statistically significant benefit for n-3 in CD (relative risk [RR] 0.77; 95% confidence interval [CI] 0.61-0.98); however, the studies were heterogeneous (I(2) = 58%). The absolute risk reduction was -0.14 (95% CI: -0.25 to -0.02). Opinions may vary on whether this is a clinically significant effect. Two well-done studies with a larger sample size reported no benefit. A sensitivity analysis excluding a small pediatric study resulted in the pooled RR being no longer statistically significant. A funnel plot analysis suggested publication bias for the smaller studies. For UC, there was no difference in the relapse rate between the n-3 and control groups (RR 1.02; 95% CI: 0.51-2.03). The pooled analysis showed a higher rate of diarrhea (RR 1.36; 95% CI: 1.01-1.84) and symptoms of the upper gastrointestinal tract (RR 1.96; 95% CI: 1.37-2.80) in the n-3 treatment group. There are insufficient data to recommend the use of omega 3 fatty acids for maintenance of remission in CD and UC.",
		id: "/oa/W2084138571",
	},
	{
		title:
			"Dietary fish oil reduces progression of chronic inflammatory lesions in a rat model of granulomatous colitis.",
		link: "/oa/W2057294019",
		abstract:
			"Eicosanoids are modulators of defensive and inflammatory processes in the gut mucosa, and may be involved in the pathogenesis of chronic inflammatory lesions of the bowel. As omega-3 fatty acids compete with the omega-6 as precursors of eicosanoid synthesis, we compared the effects of dietary supplementation with either sunflower (source of omega-6) or cod liver (source of omega-3) oil on the development of chronic granulomatous lesions in the rat colon. After four weeks on the supplemented diets, plasma omega-6 fatty acid content was significantly higher in the sunflower group, while omega-3 fatty acids predominated in the cod liver group. Inflammatory colitis was then induced by intracolonic administration of trinitrobenzene sulphonic acid. Luminal eicosanoid release, as measured by radioimmunoassay of intracolonic dialysis fluid, increased significantly after the challenge in both groups. Generation of prostaglandin E2 (PGE2) and leucotriene B4 (LTB4) peaked by day 3 and thereafter declined; thromboxane B2 (TXB2), instead, continued to increase from day 3 to 20 in sunflower fed rats, whereas this change was blunted in cod liver animals. The rats were killed 20, 30, or 50 days after the induction of colitis, and the colonic lesions were scored macroscopically (adhesions to surrounding tissues, strictures, ulcerations, and wall thickness) and histologically (ulceration, inflammation, depth of the lesions, and fibrosis). In cod liver animals, the damage score was markedly reduced by day 30, and inflammation and ulceration were almost absent by day 50. In conclusion, a fish oil diet prevents the increase in thromboxane in the chronic state of inflammation and shortens the course of the colonic disease by diminishing both the severity of the lesions and their progression to chronicity.",
		id: "/oa/W2057294019",
	},
	{
		title:
			"Effect of fish oil supplementation on plasma oxidant/antioxidant status in rats",
		link: "/oa/W1992314872",
		abstract:
			"The aim of this study was to investigate effect of dietary omega-3 fatty acid supplementation on the indices of in vivo lipid peroxidation and oxidant/antioxidant status of plasma in rats. The plasma thiobarbituric acid reactive substances (TBARS) and nitric oxide (NO) levels, and activities of xanthine oxidase (XO), superoxide dismutase (SOD) and glutathione peroxidase (GSH-PX) were studied in male Wistar Albino rats after ingestion of 0.4g/kg fish oil (rich in omega-3 fatty acids, eicosapentaenoic acid and docosahexaenoic acid) for 30 days and compared to untreated control rats. The rats in the treated group had significantly higher SOD activity (P<0.001), NO levels (P<0.01) and decreased TBARS levels (P<0.05) with respect to controls whereas GSH-Px and XO activities were not significantly different between the groups. None of the measured parameters had significant correlation with each other in both groups. We conclude that dietary supplementation of omega-3 fatty acids may enhance resistance to free radical attack and reduce lipid peroxidation. These results support the notion that omega-3 fatty acids may be effective dietary supplements in the management of various diseases in which oxidant/antioxidant defence mechanisms are decelerated.",
		id: "/oa/W1992314872",
	},
	{
		title:
			"Practical Applications of Fish Oil ( -3 Fatty Acids) in Primary Care",
		link: "/oa/W2121000713",
		abstract:
			"Fish oil (Omega-3 fatty acids) has been studied for more than 30 years. However, recent concerns of mercury and environmental toxins have clouded fish oil's potential clinical benefits. This article aims to review practical, evidence-based applications of fish oil for the primary care physician.PubMed search using key words 'fish oil,' 'docosahexaenoic,' and 'eicosapentaenoic' in title/abstract. Limited to human clinical trials. Articles were further scanned for relevant sources.For secondary prevention of cardiovascular disease, 1 g of fish oil has shown to reduce overall and cardiovascular mortality, myocardial infarction, and sudden cardiac death. Higher doses may be used for its potent triglyceride-lowering effects and for patients with rheumatoid arthritis to reduce nonsteroidal anti-inflammatory use. Omega-3 fatty acid supplementation of infant formula has shown benefit in infant neural growth and development. With the potential health benefits of fish, women of childbearing age should be encouraged to eat 1 to 2 low-mercury fish meals per week.Fish oil has numerous practical applications for the primary care physician. Understanding the diverse clinical research of Omega-3 fatty acids and fish oil is important in determining its role in primary care practices.",
		id: "/oa/W2121000713",
	},
	{
		title: "Fish Oil and Postoperative Atrial Fibrillation",
		link: "/oa/W2169902118",
		abstract:
			"Postoperative atrial fibrillation or flutter (AF) is one of the most common complications of cardiac surgery and significantly increases morbidity and health care utilization. A few small trials have evaluated whether long-chain n-3-polyunsaturated fatty acids (PUFAs) reduce postoperative AF, with mixed results.To determine whether perioperative n-3-PUFA supplementation reduces postoperative AF.The Omega-3 Fatty Acids for Prevention of Post-operative Atrial Fibrillation (OPERA) double-blind, placebo-controlled, randomized clinical trial. A total of 1516 patients scheduled for cardiac surgery in 28 centers in the United States, Italy, and Argentina were enrolled between August 2010 and June 2012. Inclusion criteria were broad; the main exclusions were regular use of fish oil or absence of sinus rhythm at enrollment.Patients were randomized to receive fish oil (1-g capsules containing ≥840 mg n-3-PUFAs as ethyl esters) or placebo, with preoperative loading of 10 g over 3 to 5 days (or 8 g over 2 days) followed postoperatively by 2 g/d until hospital discharge or postoperative day 10, whichever came first.Occurrence of postoperative AF lasting longer than 30 seconds. Secondary end points were postoperative AF lasting longer than 1 hour, resulting in symptoms, or treated with cardioversion; postoperative AF excluding atrial flutter; time to first postoperative AF; number of AF episodes per patient; hospital utilization; and major adverse cardiovascular events, 30-day mortality, bleeding, and other adverse events.At enrollment, mean age was 64 (SD, 13) years; 72.2% of patients were men, and 51.8% had planned valvular surgery. The primary end point occurred in 233 (30.7%) patients assigned to placebo and 227 (30.0%) assigned to n-3-PUFAs (odds ratio, 0.96 [95% CI, 0.77-1.20]; P = .74). None of the secondary end points were significantly different between the placebo and fish oil groups, including postoperative AF that was sustained, symptomatic, or treated (231 [30.5%] vs 224 [29.6%], P = .70) or number of postoperative AF episodes per patient (1 episode: 156 [20.6%] vs 157 [20.7%]; 2 episodes: 59 [7.8%] vs 49 [6.5%]; ≥3 episodes: 18 [2.4%] vs 21 [2.8%]) (P = .73). Supplementation with n-3-PUFAs was generally well tolerated, with no evidence for increased risk of bleeding or serious adverse events.In this large multinational trial among patients undergoing cardiac surgery, perioperative supplementation with n-3-PUFAs, compared with placebo, did not reduce the risk of postoperative AF.",
		id: "/oa/W2169902118",
	},
	{
		title:
			"Dietary Fish-Oil Supplementation in Humans Reduces UVB-Erythemal Sensitivity but Increases Epidermal Lipid Peroxidation",
		link: "/oa/W2024660458",
		abstract:
			"Ultraviolet radiation (UVR)-induced erythema may be mediated in part by free radical-generated tissue damage, including lipid peroxidation. We have examined the effect of dietary fish oil rich in omega-3 fatty acids upon susceptibility to UVB-induced erythema and epidermal lipid peroxidation. Fifteen volunteers took 10 g fish oil, containing 18% eicosapentaenoic acid and 12% docosahexaenoic acid, daily for 3 or 6 months. Sensitivity to UVB was assessed at intervals on fish oil, and 2.5 months after stopping treatment. Paired skin shave biopsies were taken from six subjects, at baseline and 3 months, from both irradiated and control skin. Fatty acid composition was analyzed and thiobarbituric acid-reactive substances measured as an index of lipid peroxidation. With increasing time on fish oil the minimal erythema dose rose progressively, from 18.9 +/- 13.9 mJ/cm2 (mean +/- SD) at baseline to 41.1 +/- 16.6 mJ/cm2 at 6 months, p < 0.01. Ten weeks after stopping fish oil the minimal erythema dose fell to 23.1 +/- 4.9 mJ/cm2, p < 0.05. Epidermal total omega-3 fatty acids rose from 1.8 +/- 0.4% total fatty acids (mean +/- SEM) to 24.2 +/- 3.9% at 3 months, p < 0.01. This was accompanied by a rise in thiobarbituric acid-reactive substances in irradiated skin from 6 +/- 0.3 (mean +/- SEM) to 18.5 +/- 2.6 A532/g skin, p < 0.01. Hence dietary omega-3 fatty acids produce a pronounced reduction in UVB-erythemal sensitivity, although susceptibility of skin to lipid peroxidation is increased. Thus, omega-3 fatty acids may act as an oxidizable buffer, protecting more vital structures from free radical damage.",
		id: "/oa/W2024660458",
	},
	{
		title: "Fish Consumption, Fish Oil, Lipids, and Coronary Heart Disease",
		link: "/oa/W2096044750",
		abstract:
			"HomeCirculationVol. 94, No. 9Fish Consumption, Fish Oil, Lipids, and Coronary Heart Disease Free AccessResearch ArticleDownload EPUBAboutView EPUBSections ToolsAdd to favoritesDownload citationsTrack citationsPermissions ShareShare onFacebookTwitterLinked InMendeleyReddit Jump toFree AccessResearch ArticleDownload EPUBFish Consumption, Fish Oil, Lipids, and Coronary Heart Disease Neil J. Stone Neil J. StoneNeil J. Stone From the Nutrition Committee of the American Heart Association Search for more papers by this author Originally published1 Nov 1996https://doi.org/10.1161/01.CIR.94.9.2337Circulation. 1996;94:2337–2340Reducing intake of saturated fat and dietary cholesterol and avoiding excess calories, which can lead to obesity, remain the cornerstore of the dietary approach to decreasing risk of atherosclerotic vascular disease. During the past 20 years, however, there has been renewed interest in other dietary components that might favorably improve lipid profiles and reduce risk of coronary heart disease (CHD). Fish and fish oil, rich sources of omega-3 fatty acids, have sparked intense interest in both epidemiological studies, which suggest a favorable effect on CHD, and metabolic ward studies, which show a striking improvement in lipid profiles in hyperlipidemic patients. Confusion has resulted from clinical trials of fish oil in patients with CHD, which did not corroborate early observational findings, and newer results, which suggest clinical benefit due to a mechanism independent of lipid effects.What Are Omega-3 Fatty Acids?Fish and other marine life are rich sources of a special class of polyunsaturated fatty acids known as the omega-3 or n-3 fatty acids.12 They are so named because the first of the several double bonds occur three carbon atoms away from the terminal end of the carbon chain. The three n-3 polyunsaturated fatty acids (n-3 PUFAs) are alpha linolenic acid (LNA), eicosapentenoic acid (EPA), and docosahexenoic acid (DHA). LNA is an 18–carbon chain fatty acid with three double bonds; in the form of tofu, soybean, and canola oil and nuts, it is an important plant-based source of n-3 PUFA for vegetarians and non–seafood eaters. EPA and DHA are very long–chain fatty acids obtained from marine sources. These, along with n-6 polyunsaturated fatty acids (n-6 PUFAs) that cannot be synthesized from nonlipid precursors such as linoleic acid, are considered essential fatty acids that must be consumed in the diet.",
		id: "/oa/W2096044750",
	},
	{
		title:
			"Conventional spray-drying and future trends for the microencapsulation of fish oil",
		link: "/oa/W2484495556",
		abstract:
			"Polyunsaturated fatty acids, especially long-chain polyunsaturated omega-3 fatty acids (LCω3-PUFA), are essential in human nutrition because they play an important role in humans and prevent several diseases. Fish oil is a natural source of LCω3-PUFA that can be incorporated into food products. One of the major drawbacks of oils containing a high amount of LCω3-PUFA, such as fish oils, is their high susceptibility to oxidation and unpleasant flavours. Microencapsulation of fish oil by spray-drying has been proposed as a strategy to retard lipid auto-oxidation, improving oil stability, prolonging its shelf life, limiting the development of off-flavours and controlling the release into food. The encapsulation of fish oil by conventional spray-drying has been performed by preparing fish oil-in-water emulsions (micro- or nano-sized) by applying high shearing forces. The objective of this review is to compile the scientific research on the encapsulation of fish oil to discuss the main formulation and process variables that affect the physicochemical properties of the fish oil microparticles obtained by conventional spray-drying, the stability of fish oil during storage and the application of fish oil microparticles in food systems. An alternative strategy to conventional spray-drying (water-free spray-drying) is also proposed.",
		id: "/oa/W2484495556",
	},
	{
		title:
			"A multicenter study of the effect of dietary supplementation with fish oil omega-3 fatty acids on carprofen dosage in dogs with osteoarthritis",
		link: "/oa/W2151215265",
		abstract:
			"To determine the effects of feeding a diet supplemented with fish oil omega-3 fatty acids on carprofen dosage in dogs with osteoarthritis.Randomized, controlled, multisite clinical trial.131 client-owned dogs with stable chronic osteoarthritis examined at 33 privately owned veterinary hospitals in the United States.In all dogs, the dosage of carprofen was standardized over a 3-week period to approximately 4.4 mg/kg/d (2 mg/lb/d), PO. Dogs were then randomly assigned to receive a food supplemented with fish oil omega-3 fatty acids or a control food with low omega-3 fatty acid content, and 3, 6, 9, and 12 weeks later, investigators made decisions regarding increasing or decreasing the carprofen dosage on the basis of investigator assessments of 5 clinical signs and owner assessments of 15 signs.Linear regression analysis indicated that over the 12-week study period, carprofen dosage decreased significantly faster among dogs fed the supplemented diet than among dogs fed the control diet. The distribution of changes in carprofen dosage for dogs in the control group was significantly different from the distribution of changes in carprofen dosage for dogs in the test group.Results suggested that in dogs with chronic osteoarthritis receiving carprofen because of signs of pain, feeding a diet supplemented with fish oil omega-3 fatty acids may allow for a reduction in carprofen dosage.",
		id: "/oa/W2151215265",
	},
	{
		title: "Fish oil supplementation: evidence for health benefits.",
		link: "/oa/W2151098380",
		abstract:
			"Many health claims for fish oil (which contains omega-3 fatty acids) in conditions from Alzheimer disease to Zellweger syndrome are based on indirect evidence. But the evidence is direct for a benefit in coronary heart disease prevention, and the American Heart Association recently issued guidelines for the intake of omega-3 oils. This article answers a series of questions that health care professionals often ask regarding fish oil, such as what are proper dosages, and are there risks of ingesting pollutants by eating more fish or using supplements?",
		id: "/oa/W2151098380",
	},
	{
		title:
			"Randomized Study of the Safety and Efficacy of Fish Oil (Omega-3 Fatty Acid) Supplementation with Dietary and Exercise Counseling for the Treatment of Antiretroviral Therapy--Associated Hypertriglyceridemia",
		link: "/oa/W2136019600",
		abstract:
			"Omega-3 fatty acids (fish oils) reduce fasting serum triglyceride levels and cardiovascular disease risk in individuals without HIV infection. Whether omega-3 fatty acid supplementation can reduce hypertriglyceridemia associated with antiretroviral therapy is not known.We conducted an open-label, randomized trial that enrolled 52 patients receiving > or =3 active antiretrovirals who had fasting triglyceride levels of >200 mg/dL and were randomized to receive nutritionist-administered dietary and exercise counseling with or without fish oil supplementation for 16 weeks.Patients assigned to receive fish oil experienced a 25% mean decline in fasting triglyceride levels at week 4 (95% CI, -34.6% to -15.7% change), compared with a 2.8% mean increase among patients assigned to receive counseling alone (95% CI, -17.5% to +23.1% change) (P=.007). By week 16, the mean reduction in triglyceride levels in the fish oil arm remained significant, at 19.5% (95% CI, -34.9% to -4.0% change), whereas the mean decrease in the diet and exercise only arm was 5.7% (95% CI, -24.6% to +13.2% change); however, the difference between study arms was no longer statistically significant (P=.12). Low-density lipoprotein cholesterol levels had increased by 15.6% (95% CI, +4.8% to +26.4% change) at week 4 and by 22.4% (95% CI, +7.91% to +36.8% change) at week 16 in the fish oil arm but did not change in the diet and exercise only group. Fish oil was well tolerated; only 1 patient experienced treatment-limiting toxicity. Patients assigned to receive fish oil experienced a 25% mean decline in fasting triglyceride levels at week 4 (95% CI, -34.6% to -15.7% change), compared with a 2.8% mean increase in patients assigned to receive counseling alone (95% CI, -17.5% to 23.1% change) (P=.007). By week 16, the mean reduction in triglyceride levels in the fish oil arm remained significant, at 19.5% (95% CI, -34.9% to -4.0% change), whereas the mean decrease in the diet and exercise only arm was 5.7% (95% CI, -24.6% to 13.2% change); however, the difference between study arms was no longer statistically significant (P=.12). Low-density lipoprotein cholesterol levels had increased by 15.6% (95% CI, 4.8%-26.4% change) at week 4 and by 22.4% (95% CI, 7.91%-36.8% change) at week 16 in the fish oil arm but did not change in the diet and exercise only group.",
		id: "/oa/W2136019600",
	},
];

describe("PaperIdEvaluator", () => {
	describe("should validate outputted id's matches the papers provided", async () => {
		it("with a single valid id", async () => {
			const { score, value } = PaperIdEvaluator.evaluate(
				MOCKED_PAPERS,
				`${MOCKED_PAPERS[0]?.id}`,
			);

			expect(score).toEqual(1);
			expect(value).toEqual(0);
		});

		it("with multiple valid ids", async () => {
			const { score, value } = PaperIdEvaluator.evaluate(
				MOCKED_PAPERS,
				`${MOCKED_PAPERS[0]?.id}, ${MOCKED_PAPERS[4]?.id}, ${MOCKED_PAPERS[2]?.id}`,
			);

			expect(score).toEqual(1);
			expect(value).toEqual(0);
		});

		it("with multiple ids with hallucinated items", async () => {
			const { score, value } = PaperIdEvaluator.evaluate(
				MOCKED_PAPERS,
				`${MOCKED_PAPERS[0]?.id}, ${MOCKED_PAPERS[2]?.id}, ${MOCKED_PAPERS[10]?.id}, /oa/unknown_id`,
			);

			expect(score).toEqual(0.75);
			expect(value).toEqual(1);
		});
	});
});
