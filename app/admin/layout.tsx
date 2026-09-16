'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/components/admin/auth-context';
import { AdminSidebar } from '@/components/admin/sidebar';

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { session, isLoading, isAdmin, signOut } = useAuth();
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";
  const router = useRouter();

  useEffect(() => {
    if (!isLogin && !isLoading && !session) {
      router.replace('/admin/login');
    }
  }, [session, isLoading, router, isLogin]);

  if (isLogin) return <>{children}</>;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500/30 border-t-violet-500" />
      </div>
    );
  }

  if (!session) return null;
  if (!isAdmin) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-950 px-6 text-center text-white">
      <h1 className="text-2xl">Admin access required</h1>
      <p className="text-muted-foreground">This account is not approved, or admin permissions have not been configured.</p>
      <button className="rounded-xl bg-violet-600 px-6 py-3" onClick={() => void signOut()}>Sign out</button>
      <Link href="/" className="text-sm text-violet-300">Back to portfolio</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-ink-950">
      <AdminSidebar />
      <div className="lg:pl-64">
        <div className="min-h-screen px-6 py-8 pt-20 lg:pt-8">{children}</div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AuthProvider>
  );
}
