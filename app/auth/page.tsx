'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LogIn, Zap, Flame } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="pt-16 pb-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Flame className="w-10 h-10 text-[#c8f135]" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight mb-2">
          <span className="text-gray-900">PROVE</span>
          <span className="text-[#ff3d6b]">IT</span>
        </h1>
        <p className="text-gray-500 text-sm">
          Track. Prove. Win.
        </p>
      </div>

      {/* Auth Options */}
      <div className="flex-1 px-4 pb-8">
        <div className="space-y-3 max-w-sm mx-auto">
          {/* Sign In */}
          <Link href="/auth/login" className="block">
            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-[#c8f135]/50 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#c8f135]/10 flex items-center justify-center">
                    <LogIn className="w-6 h-6 text-[#c8f135]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Sign In</p>
                    <p className="text-xs text-gray-500">Access your account</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Sign Up */}
          <Link href="/auth/signup" className="block">
            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-[#c8f135]/50 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#ff3d6b]/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-[#ff3d6b]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Sign Up</p>
                    <p className="text-xs text-gray-500">Create new account</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  );
}
