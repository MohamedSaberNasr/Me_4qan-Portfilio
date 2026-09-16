'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowUpRight, Check, Copy } from 'lucide-react';

export function ProjectInquiry({ open, onOpenChange, email }: { open: boolean; onOpenChange: (open: boolean) => void; email: string }) {
  const form = useRef<HTMLFormElement>(null);
  const [brief, setBrief] = useState('');
  const [subject, setSubject] = useState('');
  const [status, setStatus] = useState('');
  const review = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { if (brief) review.current?.focus(); }, [brief]);
  const prepare = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const f=new FormData(e.currentTarget); const val=(k:string)=>String(f.get(k)||'').trim();
    setSubject(`Project inquiry — ${val('name')} — ${val('service')}`);
    setBrief(`Name: ${val('name')}\nEmail: ${val('email')}\nCompany / website: ${val('company') || 'Not provided'}\nService: ${val('service')}\nBudget (USD): ${val('budget')}\nTimeline: ${val('timeline')}\n\nProject brief:\n${val('details')}`);
    setStatus('');
  };
  const copy = async () => { try { await navigator.clipboard.writeText(brief); setStatus('Brief copied. Paste it into your email.'); } catch { setStatus('Copy is unavailable. Select and copy the brief below.'); } };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="inquiry-dialog">
    <div><p className="inquiry-eyebrow">LET’S MAKE SOMETHING MOVE</p><DialogTitle className="text-2xl sm:text-3xl">Start a Project</DialogTitle><DialogDescription className="mt-3 leading-relaxed">Tell me what you have in mind. A few details help me understand your project.</DialogDescription></div>
    <form ref={form} onSubmit={prepare} className="inquiry-form" style={brief ? { display: 'none' } : undefined}>
      <div className="inquiry-grid"><label>Your name <span>*</span><input name="name" autoComplete="name" required maxLength={80} placeholder="Your name" /></label><label>Email address <span>*</span><input name="email" type="email" autoComplete="email" required maxLength={150} placeholder="you@company.com" /></label></div>
      <label>Company or website <small>Optional</small><input name="company" autoComplete="organization" maxLength={180} placeholder="Company name or website" /></label>
      <label>What are we creating? <span>*</span><select name="service" required defaultValue=""><option value="" disabled>Select a service</option><option>SaaS explainer</option><option>Product animation</option><option>Motion graphics</option><option>3D visualization</option><option>Video / post production</option><option>Something else</option></select></label>
      <div className="inquiry-grid"><label>Budget range <span>*</span><select name="budget" required defaultValue=""><option value="" disabled>Select budget (USD)</option><option>Under $1,000</option><option>$1,000–$3,000</option><option>$3,000–$5,000</option><option>$5,000+</option><option>Let’s discuss</option></select></label><label>Ideal timeline <span>*</span><select name="timeline" required defaultValue=""><option value="" disabled>Select timeline</option><option>Within 2 weeks</option><option>2–4 weeks</option><option>1–2 months</option><option>Flexible</option></select></label></div>
      <label>Tell me about the project <span>*</span><textarea name="details" required minLength={20} maxLength={1500} rows={4} placeholder="Your product, the story you want to tell, deliverables, and any references…" /></label>
      <p className="inquiry-note">This prepares an email brief. Nothing is sent or stored on a server by this form.</p><button className="inquiry-primary" type="submit">Prepare my brief <ArrowUpRight size={16}/></button>
    </form>{brief && <div className="inquiry-review"><div className="inquiry-ready" role="status"><Check size={18}/> Your brief is ready</div><textarea ref={review} aria-label="Prepared project brief" readOnly value={brief} rows={9}/><p className="inquiry-note">Open your email app, review the draft, and send it to {email}. Your inquiry has not been sent yet.</p><a className="inquiry-primary" href={`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(brief)}`}>Open email draft <ArrowUpRight size={16}/></a><div className="inquiry-secondary"><button onClick={copy}><Copy size={14}/> Copy brief</button><button onClick={()=>{setBrief(''); requestAnimationFrame(()=>form.current?.querySelector('input')?.focus());}}>Edit details</button></div><p role="status" className="inquiry-note">{status}</p></div>}
  </DialogContent></Dialog>;
}


