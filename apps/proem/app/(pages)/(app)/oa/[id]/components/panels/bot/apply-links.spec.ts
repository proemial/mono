import { applyLinks, linkCheckReqex } from "./apply-links";

test("applyLinks", () => {
  expect(
    applyLinks(
      'No. Vaccines are <a href="https://proem.ai/oa/W2025926911?title=Vaccines+are+not+associated+with+autism%3A+An+evidence-based+meta-analysis+of+case-control+and+cohort+studies">not associated with the development of autism or autism spectrum disorder</a>. Multiple studies have found no relationship between vaccination and autism or ASD.',
      () => {}
    )
  ).toMatchSnapshot();
});

suite("lineCheckRegex", () => {
  test.skip("can match a link", () => {
    expect(
      '<a href="https://proem.ai/oa/W2025926911?title=Vaccines+are+not+associated+with+autism%3A+An+evidence-based+meta-analysis+of+case-control+and+cohort+studies">not associated with the development of autism or autism spectrum disorder</a>'.match(
        linkCheckReqex
      )?.length
    ).toBe(1);
    expect(
      'No. Vaccines are <a href="https://proem.ai/oa/W2025926911?title=Vaccines+are+not+associated+with+autism%3A+An+evidence-based+meta-analysis+of+case-control+and+cohort+studies">not associated with the development of autism or autism spectrum disorder</a>. Multiple studies have found no relationship between vaccination and autism or ASD.'.match(
        linkCheckReqex
      )?.length
    ).toBe(3);
  });
  test("can extract href and title", () => {
    const [message, href, content] =
      linkCheckReqex.exec(
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
