'use client';
import { useRef, useState, type FormEvent } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowUpRight, Check, Loader2 } from 'lucide-react';

export function ProjectInquiry({ open, onOpenChange, email }: { open: boolean; onOpenChange: (open: boolean) => void; email: string }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');
  const pending = useRef<{ payload: string; id: string } | null>(null);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const fields = Object.fromEntries(new FormData(e.currentTarget));
    const payload = JSON.stringify(fields);
    if (pending.current?.payload !== payload) pending.current = { payload, id: crypto.randomUUID() };
    setSending(true); setStatus('');
    try {
      const response = await fetch('/api/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, requestId: pending.current.id }) });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error(result.error || 'Unable to send. Please try again.');
      setSent(true);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Connection failed. Your details are still here; please retry.');
    } finally { setSending(false); }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="inquiry-dialog">
    <div><p className="inquiry-eyebrow">LET’S MAKE SOMETHING MOVE</p><DialogTitle className="text-2xl sm:text-3xl">Start a Project</DialogTitle><DialogDescription className="mt-3 leading-relaxed">Tell me what you have in mind. A few details help me understand your project.</DialogDescription></div>
    <form onSubmit={submit} className="inquiry-form" aria-busy={sending} style={sent ? { display: 'none' } : undefined}>
      <div className="inquiry-honeypot" aria-hidden="true"><label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="inquiry-grid"><label>Your name <span>*</span><input name="name" autoComplete="name" required maxLength={80} placeholder="Your name" /></label><label>Email address <span>*</span><input name="email" type="email" autoComplete="email" required maxLength={150} placeholder="you@company.com" /></label></div>
      <label>Company or website <small>Optional</small><input name="company" autoComplete="organization" maxLength={180} placeholder="Company name or website" /></label>
      <label>What are we creating? <span>*</span><select name="service" required defaultValue=""><option value="" disabled>Select a service</option><option>SaaS explainer</option><option>Product animation</option><option>Motion graphics</option><option>3D visualization</option><option>Video / post production</option><option>Something else</option></select></label>
      <div className="inquiry-grid"><label>Budget range <span>*</span><select name="budget" required defaultValue=""><option value="" disabled>Select budget (USD)</option><option>Under $1,000</option><option>$1,000–$3,000</option><option>$3,000–$5,000</option><option>$5,000+</option><option>Let’s discuss</option></select></label><label>Ideal timeline <span>*</span><select name="timeline" required defaultValue=""><option value="" disabled>Select timeline</option><option>Within 2 weeks</option><option>2–4 weeks</option><option>1–2 months</option><option>Flexible</option></select></label></div>
      <label>Tell me about the project <span>*</span><textarea name="details" required minLength={20} maxLength={1500} rows={4} placeholder="Your product, the story you want to tell, deliverables, and any references…" /></label>
      <p className="inquiry-note">Your details will be emailed directly to me so I can reply about your project.</p>
      {status && <p role="alert" className="inquiry-error">{status}</p>}
      <button className="inquiry-primary" type="submit" disabled={sending}>{sending ? <>Sending… <Loader2 size={16} className="animate-spin" /></> : <>Send project inquiry <ArrowUpRight size={16}/></>}</button>
      <a className="inquiry-note" href={`mailto:${email}`}>Prefer email? Contact me directly</a>
    </form>{sent && <div className="inquiry-review"><div className="inquiry-ready" role="status"><Check size={18}/> Your inquiry has been sent</div><p className="inquiry-note">Thank you. I’ll review your brief and reply to the email address you provided.</p><button className="inquiry-primary" onClick={() => onOpenChange(false)}>Done <Check size={16}/></button></div>}
  </DialogContent></Dialog>;
}


