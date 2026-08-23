import { DocumentResult } from '@/types/document';

export const mockDocumentResult: DocumentResult = {
  fileName: "quarterly_financial_report_q2_2025.pdf",
  fileSize: 2457600, // 2.4 MB
  fileType: "application/pdf",
  extractedText: `QUARTERLY FINANCIAL REPORT — Q2 2025
Enterprise Solutions Group

1. Executive Overview
During the second quarter of fiscal year 2025, the Enterprise Solutions Group recorded total revenue of $48.2 million, representing an 18.5% year-over-year increase compared to Q2 2024 ($40.7 million). This growth was driven primarily by strong adoption of our cloud-native workflow platform and enterprise subscription renewals.

2. Financial Highlights
- Gross Margin: Expanded by 240 basis points to 74.2%, up from 71.8% in the prior year.
- Operating Income: Reached $11.4 million, compared to $8.9 million in Q2 2024.
- Net Income: $8.7 million, with diluted earnings per share (EPS) of $0.42 versus $0.31 in Q2 2024.
- Cash & Equivalents: Total cash balance stood at $62.3 million as of June 30, 2025.

3. Operational Performance & Customer Metrics
- Net Revenue Retention (NRR): Maintained a healthy rate of 118%.
- Customer Acquisition: Added 142 new enterprise clients, bringing total active customer count to 1,840.
- Customer Churn: Reduced to 1.8% annualized, compared to 2.4% in the previous quarter.

4. Strategic Initiatives & Outlook
- Product Expansion: Launched the AI Document Analysis Suite in May 2025, now contributing 6% of new pipeline inquiries.
- Infrastructure Optimization: Completed multi-region cloud migration, reducing average latency by 35% and projected annual hosting costs by $1.2 million.
- Full-Year Guidance: Raising full-year revenue outlook to $195M - $200M (previously $188M - $193M).`,
  summary: {
    short: "The Enterprise Solutions Group achieved $48.2 million in Q2 2025 revenue (up 18.5% YoY) with strong adoption of cloud platforms and improved gross margins at 74.2%. Full-year revenue guidance was raised to $195M–$200M following 142 new enterprise customer additions and reduced churn.",
    medium: "In Q2 2025, the Enterprise Solutions Group demonstrated strong operational and financial performance, reporting $48.2 million in revenue—an 18.5% year-over-year growth. Gross margin improved to 74.2%, and operating income rose to $11.4 million. The company added 142 new enterprise accounts, decreased annualized customer churn to 1.8%, and maintained a solid 118% Net Revenue Retention rate.\n\nStrategic milestones included the rollout of the AI Document Analysis Suite and the completion of a multi-region cloud migration yielding $1.2M in annual hosting savings. Given robust enterprise demand, full-year revenue guidance has been raised to $195M–$200M.",
    long: "The Enterprise Solutions Group delivered robust financial and strategic progress during the second quarter of fiscal 2025. Total revenue rose by 18.5% year-over-year to $48.2 million, driven by high enterprise subscription renewal rates and accelerated adoption of the cloud-native workflow platform.\n\nKey Financial Metrics:\n• Gross margin expanded by 240 basis points to 74.2% (from 71.8% in Q2 2024).\n• Operating income grew to $11.4 million compared to $8.9 million in the prior period.\n• Net income reached $8.7 million, delivering diluted EPS of $0.42.\n• Balance sheet strength remained resilient with $62.3 million in cash and cash equivalents.\n\nOperational & Commercial Momentum:\n• Customer count expanded with 142 new enterprise additions (reaching 1,840 total accounts).\n• Net Revenue Retention remained strong at 118%, while churn dropped from 2.4% to 1.8%.\n• The newly introduced AI Document Analysis Suite already accounts for 6% of incoming enterprise pipeline.\n\nInfrastructure & Future Outlook:\nCompletion of the multi-region infrastructure migration resulted in a 35% latency improvement and an estimated $1.2 million in annualized cost efficiencies. Consequently, management has increased full-year revenue guidance to between $195 million and $200 million."
  },
  keyPoints: [
    "Q2 2025 revenue grew 18.5% YoY to $48.2M with gross margins expanding to 74.2%.",
    "Net income reached $8.7M ($0.42 diluted EPS) with $62.3M in cash reserves.",
    "Added 142 new enterprise customers with Net Revenue Retention remaining strong at 118%.",
    "Annualized customer churn decreased from 2.4% to 1.8%.",
    "Completed cloud migration saving $1.2M annually while improving latency by 35%.",
    "Raised full-year 2025 revenue forecast to $195M - $200M."
  ],
  improvementSuggestions: [
    "Include a regional or segment-by-segment revenue breakdown to highlight geographic growth drivers.",
    "Add a competitive benchmark comparison for the Net Revenue Retention (118%) metric.",
    "Clarify customer acquisition cost (CAC) payback periods alongside the new enterprise additions.",
    "Provide a detailed timeline and projected milestones for the AI Document Analysis Suite rollout."
  ]
};
