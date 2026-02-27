import { redirect } from 'next/navigation';
import { SignupForm } from '@/components/auth/SignupForm';
import { getCurrentUser } from '@/lib/appwrite/api';
import { Flame } from 'lucide-react';

export const metadata = {
  title: 'Sign Up | ProveIt',
  description: 'Create a new ProveIt account',
};

export default async function SignupPage() {
  // Check if user is already logged in
  const user = await getCurrentUser();
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Flame className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-primary">ProveIt</h1>
        </div>

        {/* Form */}
        <SignupForm />

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Join thousands proving their progress every day.</p>
        </div>
      </div>
    </div>
  );
}
