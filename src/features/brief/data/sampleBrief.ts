import { Brief } from '../../../types/index.ts';

export const sampleBrief: Brief = {
  id: 'brief-001',
  title: 'Motion to Dismiss for Failure to State a Claim',
  content: `# MEMORANDUM IN SUPPORT OF DEFENDANT'S MOTION TO DISMISS

## I. INTRODUCTION

Defendant TechCorp Industries moves to dismiss Plaintiff's Complaint for failure to state a claim upon which relief can be granted. The Complaint's securities fraud allegations fall far short of the heightened pleading requirements established by Congress and interpreted by the Supreme Court.

## II. LEGAL STANDARD

To survive a motion to dismiss under Rule 12(b)(6), a complaint must contain "enough facts to state a claim to relief that is plausible on its face." [[CITATION:1]] A claim is facially plausible "when the plaintiff pleads factual content that allows the court to draw the reasonable inference that the defendant is liable for the misconduct alleged." [[CITATION:2]]

For securities fraud claims under Section 10(b) and Rule 10b-5, plaintiffs must meet the heightened pleading requirements of the **Private Securities Litigation Reform Act** ("PSLRA"). The complaint must:

1. Specify each statement alleged to have been misleading
2. State the reason or reasons why the statement is misleading
3. Plead with particularity facts giving rise to a strong inference of scienter

See [[CITATION:3]]

## III. ARGUMENT

### A. Plaintiff Fails to Plead Material Misrepresentation

The Complaint does not identify any actionable misstatement. Plaintiff points to forward-looking statements in TechCorp's earnings calls, but such statements are protected by the PSLRA's safe harbor provision.

> The Supreme Court has made clear that a plaintiff must prove that the defendant's misrepresentation was the **actual cause** of the investment loss.

[[CITATION:4]]

Moreover, the statements Plaintiff challenges are classic *corporate puffery*—vague expressions of optimism that no reasonable investor would rely upon. Courts consistently hold that general statements about a company's business prospects are not actionable. [[CITATION:5]]

### B. Plaintiff Fails to Adequately Plead Scienter

Even if Plaintiff had identified a material misstatement, the Complaint fails to plead scienter with the particularity required by the PSLRA. Plaintiff must allege facts giving rise to a "strong inference" of fraudulent intent—one that is:

- More than merely plausible or reasonable
- Cogent and compelling
- At least as compelling as any opposing inference of nonfraudulent intent

[[CITATION:6]]

The Complaint's allegations of scienter rest entirely on the fact that TechCorp's stock price declined after the company revised its revenue guidance. But stock price drops alone **do not establish scienter**.

---

## IV. CONCLUSION

For the foregoing reasons, Defendant respectfully requests that the Court grant this Motion to Dismiss and dismiss Plaintiff's Complaint with prejudice.`,
  citations: [
    {
      id: 'cit-1',
      text: 'Bell Atlantic Corp. v. Twombly, 550 U.S. 544, 570 (2007)',
      caseName: 'Bell Atlantic Corp. v. Twombly',
      reporter: '550 U.S. 544',
      pinCite: '570',
      year: 2007,
      position: { start: 407, end: 421 },
    },
    {
      id: 'cit-2',
      text: 'Ashcroft v. Iqbal, 556 U.S. 662, 678 (2009)',
      caseName: 'Ashcroft v. Iqbal',
      reporter: '556 U.S. 662',
      pinCite: '678',
      year: 2009,
      position: { start: 556, end: 570 },
    },
    {
      id: 'cit-3',
      text: "Henderson v. United States Dep't of Justice, 612 F.3d 1122, 1130 (9th Cir. 2010)",
      caseName: "Henderson v. United States Dep't of Justice",
      reporter: '612 F.3d 1122',
      pinCite: '1130',
      year: 2010,
      position: { start: 855, end: 869 },
    },
    {
      id: 'cit-4',
      text: 'Dura Pharmaceuticals, Inc. v. Broudo, 544 U.S. 336, 342 (2005)',
      caseName: 'Dura Pharmaceuticals, Inc. v. Broudo',
      reporter: '544 U.S. 336',
      pinCite: '342',
      year: 2005,
      position: { start: 1301, end: 1315 },
    },
    {
      id: 'cit-5',
      text: 'Basic Inc. v. Levinson, 485 U.S. 224, 231 (1988)',
      caseName: 'Basic Inc. v. Levinson',
      reporter: '485 U.S. 224',
      pinCite: '231',
      year: 1988,
      position: { start: 1551, end: 1565 },
    },
    {
      id: 'cit-6',
      text: 'Tellabs, Inc. v. Makor Issues & Rights, Ltd., 551 U.S. 308, 314 (2007)',
      caseName: 'Tellabs, Inc. v. Makor Issues & Rights, Ltd.',
      reporter: '551 U.S. 308',
      pinCite: '314',
      year: 2007,
      position: { start: 2050, end: 2064 },
    },
  ],
  verificationResults: [
    {
      id: 'ver-1',
      citationId: 'cit-1',
      status: 'valid',
      severity: 'none',
      message:
        'Citation verified. Case exists and the cited page contains the referenced "plausibility" standard for Rule 12(b)(6) motions.',
    },
    {
      id: 'ver-2',
      citationId: 'cit-2',
      status: 'quote_mismatch',
      severity: 'warning',
      message:
        'Quote does not match source. The brief\'s quotation differs materially from the original text in Iqbal.',
      details: {
        expectedQuote:
          'when the plaintiff pleads factual content that allows the court to draw the reasonable inference that the defendant is liable for the misconduct alleged',
        actualQuote:
          'A claim has facial plausibility when the plaintiff pleads factual content that allows the court to draw the reasonable inference that the defendant is liable for the misconduct alleged.',
      },
    },
    {
      id: 'ver-3',
      citationId: 'cit-3',
      status: 'not_found',
      severity: 'critical',
      message:
        'Citation not found. No case matching "Henderson v. United States Dep\'t of Justice" exists at 612 F.3d 1122. This citation may be fabricated.',
    },
    {
      id: 'ver-4',
      citationId: 'cit-4',
      status: 'valid',
      severity: 'none',
      message:
        'Citation verified. Dura Pharmaceuticals establishes loss causation requirements for securities fraud claims. Pin cite accurately references the relevant holding.',
    },
    {
      id: 'ver-5',
      citationId: 'cit-5',
      status: 'overruled',
      severity: 'warning',
      message:
        'Authority status: Partially overruled. The "fraud on the market" presumption from Basic Inc. was significantly limited by Halliburton Co. v. Erica P. John Fund, Inc., 573 U.S. 258 (2014).',
      details: {
        treatmentHistory:
          'Basic Inc. v. Levinson established the "fraud on the market" presumption of reliance. However, Halliburton II (2014) held that defendants may rebut this presumption at class certification by showing a lack of price impact. The core holding remains valid but has been substantially limited.',
      },
    },
    {
      id: 'ver-6',
      citationId: 'cit-6',
      status: 'valid',
      severity: 'none',
      message:
        'Citation verified. Tellabs establishes the "strong inference" standard for pleading scienter under the PSLRA. Pin cite correctly references the cogency requirement.',
    },
  ],
};
