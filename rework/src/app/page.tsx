import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { InfoCards } from "@/components/sections/info-cards";
import { Projects } from "@/components/sections/projects";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="container mx-auto flex-1 space-y-6 px-4 py-8">
                {/* Hero */}
                <div className="animate-fade-in">
                    <Hero />
                </div>

                {/* Info Cards */}
                <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                    <InfoCards />
                </div>

                {/* Projects */}
                <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                    <Projects />
                </div>
            </main>
            <Footer />
        </div>
    );
}