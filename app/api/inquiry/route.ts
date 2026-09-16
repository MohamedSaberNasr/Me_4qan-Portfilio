import { NextResponse } from 'next/server';
import { inquirySchema } from '@/lib/inquiry';
import { sendInquiry } from '@/lib/send-inquiry';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const attempts = new Map<string, { count: number; expires: number }>();
const reply = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) return reply('Please submit this form from the website.', 403);
  if (!request.headers.get('content-type')?.includes('application/json')) return reply('Invalid request.', 415);
  const body = await request.text();
  if (new TextEncoder().encode(body).length > 8000) return reply('Your message is too long.', 413);
  let input: unknown;
  try { input = JSON.parse(body); } catch { return reply('Invalid request.', 400); }
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) return reply('Please check your email address and complete all required fields.', 400);
  if (parsed.data.website) return reply('Unable to send this request.', 400);
  const now = Date.now();
  attempts.forEach((value, key) => { if (value.expires < now) attempts.delete(key); });
  // Best-effort per-instance protection. Provider limits still apply across instances.
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const attempt = attempts.get(ip) || { count: 0, expires: now + 600000 };
  if (attempt.count >= 5 || attempts.size >= 2000) return reply('Too many attempts. Please try again in 10 minutes.', 429);
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const recipient = 'mohsabmdr@gmail.com';
  const sender = process.env.INQUIRY_FROM_EMAIL?.trim() || 'Me4qan Portfolio <onboarding@resend.dev>';
  if (!apiKey) return reply('Sending is temporarily unavailable. Please email mohsabmdr@gmail.com directly.', 503);
  attempt.count += 1; attempts.set(ip, attempt);
  try {
    await sendInquiry(parsed.data, apiKey, sender, recipient);
    return NextResponse.json({ success: true });
  } catch {
    console.error('Project inquiry email was not accepted. Check Resend configuration and delivery logs.');
    return reply('Your request could not be sent. Your details are still here; please retry or email mohsabmdr@gmail.com.', 502);
  }
}
