import { createHash } from 'node:crypto';
import { formatInquiry, type Inquiry } from './inquiry';

// Provider acceptance is required before the visitor sees success.
export async function sendInquiry(data: Inquiry, apiKey: string, sender: string, recipient: string, fetcher: typeof fetch = fetch) {
  const text = formatInquiry(data);
  const hash = createHash('sha256').update(JSON.stringify({ sender, recipient, data })).digest('hex');
  const response = await fetcher('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `portfolio-${hash}` },
    body: JSON.stringify({ from: sender, to: [recipient], reply_to: data.email,
      subject: `Project inquiry — ${data.name.replace(/[\r\n]/g, ' ')} — ${data.service}`, text }),
    signal: AbortSignal.timeout(12000),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || typeof result?.id !== 'string' || !result.id) throw new Error('Email provider did not accept the inquiry');
  return result.id as string;
}
