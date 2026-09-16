import { Instagram, Mail } from 'lucide-react';

type FooterProps = {
  email: string;
  instagram: string;
};

export function Footer({ email, instagram }: FooterProps) {
  return (
    <footer className="relative border-t border-white/5 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <img src="/brand/avatar.png" alt="Me_4qan" width="28" height="28" className="h-6 w-6 brand-avatar rounded-full object-cover" />
          <span>Me_4qan</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={`mailto:${email}`}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
          >
            <Mail className="h-4 w-4" />
          </a>
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
          >
            <Instagram className="h-4 w-4" />
          </a>
        </div>

        <p className="text-xs text-muted-foreground/60">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
