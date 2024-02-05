import {
  applyLinks,
  aTaglinkCheckReqex,
  markdownlinkCheckReqex,
} from "./apply-links";

test("applyLinks", () => {
  expect(
    applyLinks(
      'No. Vaccines are <a href="https://proem.ai/oa/W2025926911?title=Vaccines+are+not+associated+with+autism%3A+An+evidence-based+meta-analysis+of+case-control+and+cohort+studies">not associated with the development of autism or autism spectrum disorder</a>. Multiple studies have found no relationship between vaccination and autism or ASD.',
      () => {}
    )
  ).toMatchSnapshot();
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
