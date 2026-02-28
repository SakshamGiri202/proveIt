'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Flame, ArrowLeft } from 'lucide-react';
import { account } from '@/lib/appwrite/client';
import { createUserProfile } from '@/lib/appwrite/api';

export function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    displayName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const newAccount = await account.create(
        'unique()',
        formData.email,
        formData.password
      );

      await account.createEmailPasswordSession(formData.email, formData.password);

      await createUserProfile(
        newAccount.$id,
        formData.username,
        formData.displayName,
        formData.email
      );

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-6 px-4">
        <Link href="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-8">
        <div className="max-w-sm mx-auto">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Flame className="w-10 h-10 text-[#ff3d6b]" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight mb-1">
              <span className="text-gray-900 dark:text-white">PROVE</span>
              <span className="text-[#c8f135]">IT</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 tracking-widest ml-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base focus:outline-none focus:border-[#c8f135] focus:ring-2 focus:ring-[#c8f135]/20 transition-all disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 tracking-widest ml-1">Username</label>
              <input
                type="text"
                placeholder="yourname"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base focus:outline-none focus:border-[#c8f135] focus:ring-2 focus:ring-[#c8f135]/20 transition-all disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 tracking-widest ml-1">Display Name</label>
              <input
                type="text"
                placeholder="Your Name"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base focus:outline-none focus:border-[#c8f135] focus:ring-2 focus:ring-[#c8f135]/20 transition-all disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 tracking-widest ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base focus:outline-none focus:border-[#c8f135] focus:ring-2 focus:ring-[#c8f135]/20 transition-all disabled:opacity-50"
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 ml-1">At least 8 characters</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 tracking-widest ml-1">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base focus:outline-none focus:border-[#c8f135] focus:ring-2 focus:ring-[#c8f135]/20 transition-all disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c8f135] hover:bg-[#b8e025] text-gray-900 font-black text-sm tracking-widest uppercase py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#c8f135] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
