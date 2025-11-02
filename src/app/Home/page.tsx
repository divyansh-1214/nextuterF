import {
  ArrowRight,
  Users,
  Mic,
  FileText,
  CheckSquare,
  Zap,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Header from "@/components/header";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: Users,
      title: "Community",
      description: "Collaborate and learn with peers from around the world.",
      href: "/community",
    },
    {
      icon: Mic,
      title: "Interview",
      description: "Mock interviews and skill assessment to boost your confidence.",
      href: "/interview",
    },
    {
      icon: Zap,
      title: "Auto Form",
      description: "Automatic form filling for job applications.",
      href: "/auto-form",
    },
    {
      icon: FileText,
      title: "Resume Builder",
      description: "Create and manage your professional resume easily.",
      href: "/resume",
    },
    {
      icon: CheckSquare,
      title: "Question Practice",
      description: "Practice questions tailored to your skill level.",
      href: "/practice",
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
        <Hero />
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Welcome to{" "}
              <span className="relative text-white inline-block">
                NEXTURE
                <div className="absolute inset-0 bg-primary/20 blur-3xl -z-10"></div>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Your one-stop platform to learn, practice, and grow. Master your
              skills and land your dream job.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300"
            >
              <Link href="/get-started">
                Get Started <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Link href={feature.href} key={idx}>
                  <Card className="h-full group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border border-border/50 hover:border-primary/50 bg-gradient-to-br from-card to-card/95">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/90 to-accent/90 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <CardTitle className="text-xl font-semibold flex items-center gap-2 text-foreground/90">
                        {feature.title}
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-muted-foreground/90 text-sm leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}

function Hero() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card/95 to-card/90 border border-border/50 shadow-2xl">
        <div className="p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="w-full md:w-3/5 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Your AI-Coach
              </span>
              <span className="block mt-2 text-foreground/90">Development</span>
              <span className="block mt-2 text-foreground/90">Partner</span>
            </h1>
            <p className="text-lg text-muted-foreground/90 max-w-xl leading-relaxed">
              We will help you to prepare for the interviews
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300"
              >
                <Link href="/services">
                  Explore Services <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="w-full md:w-2/5 relative">
            <Image
              src="/purple-circle-wave-static-removebg-preview.png"
              alt="Purple Wave"
              width={600}
              height={600}
              className="w-full h-auto rounded-xl transform md:scale-110 object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}