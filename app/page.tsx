import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Camera, Trophy, Users, Zap, CheckCircle } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Flame,
      title: 'Create Challenges',
      description: 'Design custom challenges with flexible durations - weekly or monthly.',
    },
    {
      icon: Camera,
      title: 'Upload Proof',
      description: 'Capture timestamped selfies directly from your camera to document progress.',
    },
    {
      icon: Users,
      title: 'Challenge Friends',
      description: 'Invite friends and see side-by-side submissions to compare progress.',
    },
    {
      icon: Trophy,
      title: 'Compete & Win',
      description: 'Climb the leaderboard and earn bragging rights among challengers.',
    },
    {
      icon: Zap,
      title: 'Track Progress',
      description: 'Visual progress trackers show your completion percentage at a glance.',
    },
    {
      icon: CheckCircle,
      title: 'Stay Motivated',
      description: 'Prove your progress daily and build accountability with your community.',
    },
  ];

  const stats = [
    { value: '2.5K+', label: 'Active Users' },
    { value: '500+', label: 'Completed Challenges' },
    { value: '50K+', label: 'Submissions' },
  ];

  return (
    <main className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:py-32 lg:py-40 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 text-sm font-semibold text-primary">
              <Flame className="w-4 h-4" />
              Welcome to ProveIt
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-balance">
              Challenge Yourself.<br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Prove Your Progress.
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
              Join the ultimate challenge platform. Create week-long or month-long challenges,
              upload timestamped selfies, and compete against friends on our real-time leaderboards.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/auth">
                <Button size="lg" className="gap-2 text-base h-12">
                  <Zap className="w-5 h-5" />
                  Get Started Now
                </Button>
              </Link>
              <Link href="/auth?guest=true">
                <Button variant="outline" size="lg" className="text-base h-12">
                  Browse as Guest
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:py-32 lg:py-40 bg-background border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold">
              Why You'll Love ProveIt
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create accountability and document your journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-20 sm:py-32 lg:py-40 bg-primary/5 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                number: 1,
                title: 'Create or Join',
                description: 'Start a challenge or join one from the community',
              },
              {
                number: 2,
                title: 'Capture Progress',
                description: 'Take timestamped photos documenting your journey',
              },
              {
                number: 3,
                title: 'Compare Results',
                description: 'View side-by-side submissions with your challengers',
              },
              {
                number: 4,
                title: 'Climb Ranks',
                description: 'Complete challenges and earn your place on the leaderboard',
              },
            ].map((step) => (
              <div key={step.number} className="relative">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
                {step.number < 4 && (
                  <div className="hidden md:block absolute top-6 -right-3 w-6 border-t-2 border-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:py-32 lg:py-40 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/10 border-t border-border">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold">
              Ready to Prove It?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of challengers documenting their progress every single day.
            </p>
          </div>

          <Link href="/auth/signup">
            <Button size="lg" className="gap-2 text-base h-12">
              <Flame className="w-5 h-5" />
              Get Started Free
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground">
            No credit card required. Start your first challenge in seconds.
          </p>
        </div>
      </section>
    </main>
  );
}
