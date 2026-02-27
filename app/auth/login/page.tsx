import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { getCurrentUser } from '@/lib/appwrite/api';

export const metadata = {
  title: 'Sign In | ProveIt',
  description: 'Sign in to your ProveIt account',
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect('/dashboard');
  }

  return <LoginForm />;
}
