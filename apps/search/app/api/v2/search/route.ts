import { fetchPapers } from "@/app/api/v2/search/search";
import { Env } from "@proemial/utils/env";
import { Time } from "@proemial/utils/time";
import { track } from "@vercel/analytics/server";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(req: Request) {
  const { q, count, tokens } = await req.json();
  // const apiKey = req.headers.get("authorization");
  // console.log({ auth: apiKey });

  // if (apiKey !== `Basic ${Env.get("GPT_API_KEY")}`) {
  //   console.log("auth failed");
  // }
  console.log({ q, count, tokens });

  const begin = Time.now();
  try {
    const response = await fetchPapers(q, count, tokens);
    await track("api:search-papers", {
      q,
      count,
      tokens,
    });

    return NextResponse.json(response);
  } finally {
    Time.log(begin, "api/v2/search");
  }
}

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("authorization");

  if (
    !(
      apiKey &&
      [
        `Basic ${Env.get("GPT_API_KEY")}`,
        `Bearer ${Env.get("GPT_API_KEY")}`,
      ].includes(apiKey)
    )
  ) {
    return Response.json({ success: false }, { status: 401 });
  }

  const q = req.nextUrl.searchParams.get("q")!;
  const count = req.nextUrl.searchParams.get("count") as any as number;
  const tokens = req.nextUrl.searchParams.get("tokens") as any as number;

  if (!q) {
    return Response.json(
      { success: "false", message: "missing q param" },
      { status: 400 }
    );
  }

  const begin = Time.now();
  try {
    // const response = await fetchPapers(q, count, tokens);
    const response = [
      {
        link: "https://proem.ai/oa/W2162305078",
        abstract:
          "In Brief Primary dysmenorrhea is painful menstrual cramps without any evident pathology to account for them, and it occurs in up to 50% of menstruating females and causes significant disruption in quality of life and absenteeism. Current understanding implicates an excessive or imbalanced amount of prostanoids and possibly eicosanoids released from the endometrium during menstruation. The uterus is induced to contract frequently and dysrhythmically, with increased basal tone and increased active pressure. Uterine hypercontractility, reduced uterine blood flow, and increased peripheral nerve hypersensitivity induce pain. Diagnosis rests on a good history with negative pelvic evaluation findings. Evidence-based data support the efficacy of cyclooxygenase inhibitors, such as ibuprofen, naproxen sodium, and ketoprofen, and estrogen-progestin oral contraceptive pills (OCPs). Cyclooxygenase inhibitors reduce the amount of menstrual prostanoids released, with concomitant reduction in uterine hypercontractility, while OCPs inhibit endometrial development and decrease menstrual prostanoids. An algorithm is provided for a simple approach to the management of primary dysmenorrhea. For treatment of primary dysmenorrhea, evidence-based data support the efficacy of cyclooxygenase inhibitors, such as ibuprofen, naproxen sodium, and ketoprofen, and estrogen-progestin oral contraceptive pills.",
        title: "Primary Dysmenorrhea",
      },
      {
        link: "https://proem.ai/oa/W2136737524",
        abstract:
          "Dysmenorrhea is a common menstrual complaint with a major impact on women's quality of life, work productivity, and health-care utilization. A comprehensive review was performed on longitudinal or case-control or cross-sectional studies with large community-based samples to accurately determine the prevalence and/or incidence and risk factors of dysmenorrhea. Fifteen primary studies, published between 2002 and 2011, met the inclusion criteria. The prevalence of dysmenorrhea varies between 16% and 91% in women of reproductive age, with severe pain in 2%-29% of the women studied. Women's age, parity, and use of oral contraceptives were inversely associated with dysmenorrhea, and high stress increased the risk of dysmenorrhea. The effect sizes were generally modest to moderate, with odds ratios varying between 1 and 4. Family history of dysmenorrhea strongly increased its risk, with odds ratios between 3.8 and 20.7. Inconclusive evidence was found for modifiable factors such as cigarette smoking, diet, obesity, depression, and abuse. Dysmenorrhea is a significant symptom for a large proportion of women of reproductive age; however, severe pain limiting daily activities is less common. This review confirms that dysmenorrhea improves with increased age, parity, and use of oral contraceptives and is positively associated with stress and family history of dysmenorrhea.",
        title: "The Prevalence and Risk Factors of Dysmenorrhea",
      },
      {
        link: "https://proem.ai/oa/W2180080828",
        abstract:
          "Primary dysmenorrhea, or painful menstruation in the absence of pelvic pathology, is a common, and often debilitating, gynecological condition that affects between 45 and 95% of menstruating women. Despite the high prevalence, dysmenorrhea is often poorly treated, and even disregarded, by health professionals, pain researchers, and the women themselves, who may accept it as a normal part of the menstrual cycle. This review reports on current knowledge, particularly with regards to the impact and consequences of recurrent menstrual pain on pain sensitivity, mood, quality of life and sleep in women with primary dysmenorrhea.Comprehensive literature searches on primary dysmenorrhea were performed using the electronic databases PubMed, Google Scholar and the Cochrane Library. Full-text manuscripts published between the years 1944 and 2015 were reviewed for relevancy and reference lists were cross-checked for additional relevant studies. In combination with the word 'dysmenorrhea' one or more of the following search terms were used to obtain articles published in peer-reviewed journals only: pain, risk factors, etiology, experimental pain, clinical pain, adenomyosis, chronic pain, women, menstrual cycle, hyperalgesia, pain threshold, pain tolerance, pain sensitivity, pain reactivity, pain perception, central sensitization, quality of life, sleep, treatment, non-steroidal anti-inflammatory drugs.Women with dysmenorrhea, compared with women without dysmenorrhea, have greater sensitivity to experimental pain both within and outside areas of referred menstrual pain. Importantly, the enhanced pain sensitivity is evident even in phases of the menstrual cycle when women are not experiencing menstrual pain, illustrating that long-term differences in pain perception extend outside of the painful menstruation phase. This enhanced pain sensitivity may increase susceptibility to other chronic pain conditions in later life; dysmenorrhea is a risk factor for fibromyalgia. Further, dysmenorrheic pain has an immediate negative impact on quality of life, for up to a few days every month. Women with primary dysmenorrhea have a significantly reduced quality of life, poorer mood and poorer sleep quality during menstruation compared with their pain-free follicular phase, and compared with the menstruation phase of pain-free control women. The prescribed first-line therapy for menstrual pain remains non-steroidal anti-inflammatory drugs, which are effective in relieving daytime and night-time pain.Further study is needed to determine whether effectively blocking dysmenorrheic pain ameliorates risk for the development of chronic pain disorders and to explore whether it is possible to prevent the development-and not just treat-severe dysmenorrheic pain in adolescent girls.",
        title:
          "What we know about primary dysmenorrhea today: a critical review",
      },
    ];
    await track("api:search-papers", {
      q,
      count,
      tokens,
    });

    return Response.json(response);
  } finally {
    Time.log(begin, "api/v2/search");
  }
}
