'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type AuthContextType = {
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
};
const AuthContext = createContext<AuthContextType>({
  session: null, isLoading: true, isAdmin: false, signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [access, setAccess] = useState<{ userId: string; allowed: boolean } | null>(null);
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (active) { setSession(error ? null : data.session); setSessionLoading(false); }
    }).catch(() => { if (active) { setSession(null); setSessionLoading(false); } });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setSessionLoading(false);
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);
  const userId = session?.user.id;
  useEffect(() => {
    let active = true;
    setAccess(null);
    if (userId) {
      supabase.rpc('is_portfolio_admin').then(({ data, error }) => {
        if (active) setAccess({ userId, allowed: !error && data === true });
      }, () => { if (active) setAccess({ userId, allowed: false }); });
    }
    return () => { active = false; };
  }, [userId]);
  const isLoading = sessionLoading || (!!userId && access?.userId !== userId);
  const isAdmin = !!userId && access?.userId === userId && access.allowed;
  const signOut = async () => { await supabase.auth.signOut(); setAccess(null); };
  return <AuthContext.Provider value={{ session, isLoading, isAdmin, signOut }}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
