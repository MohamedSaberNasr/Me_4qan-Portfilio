import { z } from 'zod';
export const inquirySchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(150),
  company: z.string().trim().max(180).default(''),
  service: z.enum(['SaaS explainer', 'Product animation', 'Motion graphics', '3D visualization', 'Video / post production', 'Something else']),
  budget: z.enum(['Under $1,000', '$1,000–$3,000', '$3,000–$5,000', '$5,000+', 'Let’s discuss']),
  timeline: z.enum(['Within 2 weeks', '2–4 weeks', '1–2 months', 'Flexible']),
  details: z.string().trim().min(20).max(1500),
  website: z.string().max(180).default(''),
  requestId: z.string().uuid(),
});
export type Inquiry = z.infer<typeof inquirySchema>;
export function formatInquiry(data: Inquiry) {
  return `Name: ${data.name}\nEmail: ${data.email}\nCompany / website: ${data.company || 'Not provided'}\nService: ${data.service}\nBudget (USD): ${data.budget}\nTimeline: ${data.timeline}\n\nProject brief:\n${data.details}`;
}
