"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowRight,
  Calendar,
  Code,
  FileText,
  Layers,
  MessageSquare,
  Users,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return null;
  if (isSignedIn) {
    redirect("/dashboard");
  }
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Layers className="h-6 w-6" />
            <span>RealTime Collab</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Collaborate in Real-Time with Your Team
              </h1>
              <p className="max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                Boost productivity with AI-powered collaboration tools,
                real-time synchronization, and seamless integrations.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Link href="/signup">
                  <Button size="lg" className="gap-1.5">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button size="lg" variant="outline">
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center mb-10">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
                Powerful Collaboration Features
              </h2>
              <p className="max-w-[700px] text-muted-foreground">
                Everything your team needs to work together efficiently in one
                place.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Users className="h-10 w-10" />}
                title="Team Collaboration"
                description="Real-time synchronization of data across all users with role-based permissions."
              />
              <FeatureCard
                icon={<FileText className="h-10 w-10" />}
                title="Document Editing"
                description="Collaborative document editing with version control and full history tracking."
              />
              <FeatureCard
                icon={<MessageSquare className="h-10 w-10" />}
                title="Messaging"
                description="Instant messaging and chat functionality for quick team communication."
              />
              <FeatureCard
                icon={<Code className="h-10 w-10" />}
                title="Code Collaboration"
                description="Real-time code editing with syntax highlighting and version control."
              />
              <FeatureCard
                icon={<Calendar className="h-10 w-10" />}
                title="Task Management"
                description="Assign and track tasks with deadlines, priorities, and progress tracking."
              />
              <FeatureCard
                icon={<Layers className="h-10 w-10" />}
                title="AI-Powered Features"
                description="Get smart suggestions and automated summaries to enhance productivity."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
                Ready to Transform Your Team's Workflow?
              </h2>
              <p className="max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                Join thousands of teams already using RealTime Collab to boost
                their productivity.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Link href="/signup">
                  <Button size="lg">Start Free Trial</Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2 font-semibold">
            <Layers className="h-5 w-5" />
            <span>RealTime Collab</span>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/features" className="hover:underline">
              Features
            </Link>
            <Link href="/pricing" className="hover:underline">
              Pricing
            </Link>
            <Link href="/blog" className="hover:underline">
              Blog
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
            <Link
              href="https://github.com/LowkeyGud"
              className="hover:underline"
            >
              Author
            </Link>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 RealTime Collab. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm border">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
