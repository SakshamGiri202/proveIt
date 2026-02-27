'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Flame, ArrowLeft } from 'lucide-react';
import { account } from '@/lib/appwrite/client';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await account.createEmailPasswordSession(email, password);
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-6 px-4">
        <Link href="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 px-4">
        <div className="max-w-sm mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Flame className="w-10 h-10 text-[#c8f135]" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight mb-1">
              <span className="text-gray-900">PROVE</span>
              <span className="text-[#ff3d6b]">IT</span>
            </h1>
            <p className="text-gray-500 text-sm">Welcome back!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 tracking-widest uppercase ml-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:border-[#c8f135] focus:ring-2 focus:ring-[#c8f135]/20 transition-all disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 tracking-widest uppercase ml-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:border-[#c8f135] focus:ring-2 focus:ring-[#c8f135]/20 transition-all disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c8f135] hover:bg-[#b8e025] text-gray-900 font-black text-sm tracking-widest uppercase py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-[#c8f135] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
