'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, LogIn } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        const result = await supabase.rpc('is_portfolio_admin');
        if (active && !result.error && result.data === true) router.replace('/admin');
      }
    }).catch(() => {});
    return () => { active = false; };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const access = await supabase.rpc('is_portfolio_admin');
      if (access.error || access.data !== true) {
        await supabase.auth.signOut();
        throw new Error('Admin access is not approved. Contact the site owner.');
      }
      toast.success('Welcome back!');
      router.replace('/admin');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div
        className="ambient-glow h-[500px] w-[500px] bg-violet-600/15"
        style={{ top: '20%', left: '50%', transform: 'translateX(-50%)' }}
      />
      <div className="noise" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-strong relative z-10 w-full max-w-md rounded-3xl p-8"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-violet-500 shadow-lg shadow-violet-600/30">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with your approved admin account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="admin-email"
                autoComplete="username"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-muted-foreground/50 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="admin-password"
                autoComplete="current-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-muted-foreground/50 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 py-3 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition-all hover:shadow-violet-600/40 hover:brightness-110 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign In
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-muted-foreground/60 transition-colors hover:text-white"
          >
            ← Back to portfolio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
