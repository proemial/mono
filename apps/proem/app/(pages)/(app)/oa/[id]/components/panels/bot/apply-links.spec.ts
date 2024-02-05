import {
  applyLinks,
  aTaglinkCheckReqex,
  markdownlinkCheckReqex,
} from "./apply-links";

const ANSWER_WITH_A_TAG_LINK =
  'No. Vaccines are <a href="https://proem.ai/oa/W2025926911?title=Vaccines+are+not+associated+with+autism%3A+An+evidence-based+meta-analysis+of+case-control+and+cohort+studies">not associated with the development of autism or autism spectrum disorder</a>. Multiple studies have found no relationship between vaccination and autism or ASD.';
const ANSWER_WITH_MARDOWN_LINK =
  "Dreams are a remarkable experiment in psychology and neuroscience, revealing that the human brain can generate entire conscious experiences by itself, disconnected from the environment. Content analysis and developmental studies promote understanding of dream phenomenology. Brain lesion studies, functional imaging, and neurophysiology have advanced knowledge of the neural basis of dreaming. [Dreaming and the brain: from phenomenology to neurophysiology](https://proem.ai/oa/W2081767153?title=Dreaming%20and%20the%20brain:%20from%20phenomenology%20to%20neurophysiology) The brain as a dream state generator: an activation-synthesis hypothesis of the dream process, [The brain as a dream state generator: an activation-synthesis hypothesis of the dream process](https://proem.ai/oa/W1750887975?title=The%20brain%20as%20a%20dream%20state%20generator:%20an%20activation-synthesis%20hypothesis%20of%20the%20dream%20process)";

test("applyLinks can handle markdown + a tag links", () => {
  expect(applyLinks(ANSWER_WITH_A_TAG_LINK, () => {})).toMatchSnapshot();
  expect(applyLinks(ANSWER_WITH_MARDOWN_LINK, () => {})).toMatchSnapshot();
});

suite("lineCheckRegex", () => {
  suite("can handle a tags", () => {
    test("can match a link", () => {
      expect(
        '<a href="https://proem.ai/oa/W2025926911?title=Vaccines+are+not+associated+with+autism%3A+An+evidence-based+meta-analysis+of+case-control+and+cohort+studies">not associated with the development of autism or autism spectrum disorder</a>'.match(
          aTaglinkCheckReqex
        )?.length
      ).toBe(1);
      expect(
        'No. Vaccines are <a href="https://proem.ai/oa/W2025926911?title=Vaccines+are+not+associated+with+autism%3A+An+evidence-based+meta-analysis+of+case-control+and+cohort+studies">not associated with the development of autism or autism spectrum disorder</a>. Multiple studies have found no relationship between vaccination and autism or ASD.'.match(
          aTaglinkCheckReqex
        )?.length
      ).toBe(1);
    });
    test("can extract href and title", () => {
      const [message, href, content] =
        aTaglinkCheckReqex.exec(
          'No. Vaccines are <a href="https://proem.ai/oa/W2025926911?title=Vaccines+are+not+associated+with+autism%3A+An+evidence-based+meta-analysis+of+case-control+and+cohort+studies">not associated with the development of autism or autism spectrum disorder</a>. Multiple studies have found no relationship between vaccination and autism or ASD.'
        ) ?? [];

      expect(message).toBe(
        '<a href="https://proem.ai/oa/W2025926911?title=Vaccines+are+not+associated+with+autism%3A+An+evidence-based+meta-analysis+of+case-control+and+cohort+studies">not associated with the development of autism or autism spectrum disorder</a>'
      );
      expect(href).toBe(
        "https://proem.ai/oa/W2025926911?title=Vaccines+are+not+associated+with+autism%3A+An+evidence-based+meta-analysis+of+case-control+and+cohort+studies"
      );
      expect(content).toBe(
        "not associated with the development of autism or autism spectrum disorder"
      );
    });
  });
  suite("can handle markdown links", () => {
    test("can match a link", () => {
      expect(
        "[Read more](https://proem.ai/oa/W2025926911?title=Vaccines+are+not+associated+with+autism%3A+An+evidence-based+meta-analysis+of+case-control+and+cohort+studies)".match(
          markdownlinkCheckReqex
        )?.length
      ).toBe(1);
      expect(
        "No. Vaccines are [Read more](https://proem.ai/oa/W2025926911?title=Vaccines+are+not+associated+with+autism%3A+An+evidence-based+meta-analysis+of+case-control+and+cohort+studies). Multiple studies have found no relationship between vaccination and autism or ASD.".match(
          markdownlinkCheckReqex
        )?.length
      ).toBe(1);
    });
    test("can extract href and title", () => {
      const [message, content, href] =
        markdownlinkCheckReqex.exec(
          "No. Vaccines are [Read more](https://proem.ai/oa/W2025926911?title=Vaccines+are+not+associated+with+autism%3A+An+evidence-based+meta-analysis+of+case-control+and+cohort+studies). Multiple studies have found no relationship between vaccination and autism or ASD."
        ) ?? [];

      expect(message).toBe(
        "[Read more](https://proem.ai/oa/W2025926911?title=Vaccines+are+not+associated+with+autism%3A+An+evidence-based+meta-analysis+of+case-control+and+cohort+studies)"
      );
      expect(href).toBe(
        "https://proem.ai/oa/W2025926911?title=Vaccines+are+not+associated+with+autism%3A+An+evidence-based+meta-analysis+of+case-control+and+cohort+studies"
      );
      expect(content).toBe("Read more");
    });
  });
});
